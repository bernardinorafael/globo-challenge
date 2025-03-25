package participant

import (
	"context"

	"github.com/bernardinorafael/globo-challenge/pkg/errs"
)

type service struct {
	ctx           context.Context
	partipantRepo Repository
}

func NewService(ctx context.Context, partipantRepo Repository) Service {
	return &service{
		ctx:           ctx,
		partipantRepo: partipantRepo,
	}
}

func (s *service) AssignElimination(ctx context.Context, participantId string, eliminationId string) error {
	record, err := s.partipantRepo.GetByID(ctx, participantId)
	if err != nil {
		return errs.NewBadRequestError("failed to get participant by id", err)
	}

	participant, err := NewParticipantFromDatabase(*record)
	if err != nil {
		return errs.NewBadRequestError("failed to create participant from database", err)
	}
	participant.SetElimination(eliminationId)

	err = s.partipantRepo.Update(ctx, participant.Store())
	if err != nil {
		return errs.NewBadRequestError("failed to update participant", err)
	}

	return nil
}

func (s *service) DeleteParticipant(ctx context.Context, participantId string) error {
	record, err := s.partipantRepo.GetByID(ctx, participantId)
	if err != nil {
		return errs.NewBadRequestError("failed to get participant by id", err)
	}
	if record == nil {
		return errs.NewNotFoundError("participant not found", err)
	}

	err = s.partipantRepo.Delete(ctx, participantId)
	if err != nil {
		return errs.NewBadRequestError("failed to delete participant", err)
	}

	return nil
}

func (s *service) GetAllParticipants(ctx context.Context) ([]Entity, error) {
	participants, err := s.partipantRepo.GetAll(ctx)
	if err != nil {
		return nil, errs.NewBadRequestError("failed to get all participants", err)
	}

	return participants, nil
}

func (s *service) CreateParticipant(ctx context.Context, name string) error {
	participants, err := s.GetAllParticipants(ctx)
	if err != nil {
		return errs.NewBadRequestError("failed to get all participants", err)
	}

	// Maximum number of participants is 8
	if len(participants) == 8 {
		return errs.NewForbiddenError(
			"cannot create more than 24 participants",
			errs.ResourceLimitReached,
			err,
		)
	}

	participant, err := s.partipantRepo.GetByName(ctx, name)
	if err != nil {
		return errs.NewBadRequestError("failed to get participant by name", err)
	}
	if participant != nil {
		return errs.NewConflictError("participant name already taken", err)
	}

	newParticipant, err := NewParticipant(name)
	if err != nil {
		return errs.NewUnprocessableEntityError(err.Error(), err)
	}

	err = s.partipantRepo.Insert(ctx, newParticipant.Store())
	if err != nil {
		return errs.NewBadRequestError("failed to insert participant into database", err)
	}

	return nil
}
