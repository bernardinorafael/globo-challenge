package elimination

import (
	"context"
	"encoding/json"
	"log/slog"
	"math"
	"time"

	"github.com/bernardinorafael/globo-bbb-challenge/internal/metric"
	"github.com/bernardinorafael/globo-bbb-challenge/internal/modules/participant"
	"github.com/bernardinorafael/globo-bbb-challenge/internal/queue"
	"github.com/bernardinorafael/globo-bbb-challenge/internal/shared/dto"
	"github.com/bernardinorafael/globo-bbb-challenge/internal/util"
	"github.com/bernardinorafael/globo-bbb-challenge/pkg/errs"
)

const (
	maxEliminationAllowed = 1
)

type service struct {
	ctx                context.Context
	eliminationRepo    Repository
	participantService participant.Service
	queue              *queue.Queue
	metrics            *metric.Metric
}

func NewService(
	ctx context.Context,
	eliminationRepo Repository,
	participantService participant.Service,
	queue *queue.Queue,
	metrics *metric.Metric,
) Service {
	return &service{
		ctx:                ctx,
		eliminationRepo:    eliminationRepo,
		participantService: participantService,
		queue:              queue,
		metrics:            metrics,
	}
}

func (s service) GetResult(ctx context.Context, eliminationId string) ([]ParticipantResult, error) {
	result, err := s.eliminationRepo.GetResult(ctx, eliminationId)
	if err != nil {
		slog.Error("failed to get elimination result", "error", err)
		return nil, errs.NewBadRequestError("failed to get elimination result", err)
	}

	return result, nil
}

func (s service) GetDashboard(ctx context.Context) (*DashboardResult, error) {
	elimination, err := s.eliminationRepo.GetUniqueOpen(ctx)
	if err != nil {
		return nil, errs.NewBadRequestError("failed to get unique open elimination", err)
	}
	if elimination == nil {
		return nil, errs.NewBadRequestError("no open elimination found", err)
	}

	votes, err := s.eliminationRepo.GetVotesByEliminationID(ctx, elimination.ID)
	if err != nil {
		slog.Error("failed to get votes by elimination id", "error", err)
		return nil, errs.NewBadRequestError("failed to get votes by elimination id", err)
	}

	var spreadVotes [24]int
	for _, v := range votes {
		hour := v.Created.Hour()
		spreadVotes[hour]++
	}

	// TODO: retrieve totalVotes and totalUsers in a single query
	totalVotes, err := s.eliminationRepo.GetTotalVotes(ctx)
	if err != nil {
		return nil, errs.NewBadRequestError("failed to get total votes", err)
	}
	totalUsers, err := s.eliminationRepo.GetTotalUsers(ctx)
	if err != nil {
		return nil, errs.NewBadRequestError("failed to get total users", err)
	}

	result := &DashboardResult{
		TotalVotes:     totalVotes,
		TotalUsers:     totalUsers,
		VotesPerHour:   math.Round(float64(totalVotes)/24*10) / 10,
		SpreadVotes:    spreadVotes,
		HasElimination: elimination != nil,
	}

	return result, nil
}

func (s service) FinishElimination(ctx context.Context, eliminationId string) error {
	elimination, err := s.eliminationRepo.GetByIDWithParticipants(ctx, eliminationId)
	if err != nil {
		slog.Error("failed to get elimination", "error", err)
		return errs.NewBadRequestError("failed to get elimination", err)
	}
	participants := elimination.Participants

	var participantsID []string
	for _, v := range participants {
		participantsID = append(participantsID, v.ID)
	}

	err = s.eliminationRepo.FinishElimination(ctx, eliminationId, participantsID)
	if err != nil {
		return errs.NewBadRequestError("failed to finish elimination", err)
	}

	return nil
}

func (s service) Vote(ctx context.Context, input dto.CreateVote) error {
	vote := Vote{
		ID:            util.GenID("vote"),
		UserID:        input.UserID,
		EliminationID: input.EliminationID,
		ParticipantID: input.ParticipantID,
		Created:       time.Now(),
	}

	msg, err := json.Marshal(vote)
	if err != nil {
		return errs.NewBadRequestError("failed to marshal vote message", err)
	}

	err = s.queue.Publish(ctx, queue.VotesCreatedKey, msg)
	if err != nil {
		s.metrics.RecordError("queue_publish_error")
		return errs.NewBadRequestError("failed to publish vote to queue", err)
	}

	return nil
}

func (s service) GetAll(ctx context.Context) ([]EntityWithParticipants, error) {
	eliminations, err := s.eliminationRepo.GetAll(ctx)
	if err != nil {
		return nil, errs.NewBadRequestError("failed to get eliminations", err)
	}

	return eliminations, nil
}

func (s service) GetAllOpen(ctx context.Context) ([]EntityWithParticipants, error) {
	eliminations, err := s.eliminationRepo.GetAllOpen(ctx)
	if err != nil {
		slog.Error("failed to get eliminations", "error", err)
		return nil, errs.NewBadRequestError("failed to get eliminations", err)
	}

	return eliminations, nil
}

func (s service) CreateElimination(ctx context.Context, participants []string) error {
	eliminations, err := s.eliminationRepo.GetAll(ctx)
	if err != nil {
		return errs.NewBadRequestError("failed to get eliminations", err)
	}

	var openEliminations []EntityWithParticipants
	for _, elimination := range eliminations {
		if elimination.Open {
			openEliminations = append(openEliminations, elimination)
		}
	}

	if len(openEliminations) >= maxEliminationAllowed {
		return errs.NewForbiddenError(
			"only 1 enabled elimination is allowed",
			errs.ResourceLimitReached,
			nil,
		)
	}

	newElimination := NewElimination()

	err = s.eliminationRepo.Insert(ctx, newElimination.Store())
	if err != nil {
		return errs.NewBadRequestError("failed to create elimination", err)
	}

	for _, participantId := range participants {
		err = s.participantService.AssignElimination(ctx, participantId, newElimination.ID())
		if err != nil {
			return errs.NewBadRequestError("failed to assign elimination to participant", err)
		}
	}

	return nil
}
