package elimination

import (
	"context"

	"github.com/bernardinorafael/globo-bbb-challenge/internal/shared/dto"
)

type Repository interface {
	Insert(ctx context.Context, elimination Entity) error
	GetAll(ctx context.Context) ([]EntityWithParticipants, error)
	GetAllOpen(ctx context.Context) ([]EntityWithParticipants, error)
	GetByID(ctx context.Context, eliminationId string) (*Entity, error)
	GetUniqueOpen(ctx context.Context) (*Entity, error)
	GetByIDWithParticipants(ctx context.Context, eliminationId string) (*EntityWithParticipants, error)
	InsertVote(ctx context.Context, vote Vote) error
	GetResult(ctx context.Context, eliminationId string) ([]ParticipantResult, error)
	GetTotalVotes(ctx context.Context) (int, error)
	GetTotalUsers(ctx context.Context) (int, error)
	FinishElimination(ctx context.Context, eliminationId string, participants []string) error
	GetVotesByEliminationID(ctx context.Context, eliminationId string) ([]Vote, error)
}

type Service interface {
	CreateElimination(ctx context.Context, participants []string) error
	GetAll(ctx context.Context) ([]EntityWithParticipants, error)
	GetAllOpen(ctx context.Context) ([]EntityWithParticipants, error)
	Vote(ctx context.Context, input dto.CreateVote) error
	GetResult(ctx context.Context, eliminationId string) ([]ParticipantResult, error)
	FinishElimination(ctx context.Context, eliminationId string) error
	GetDashboard(ctx context.Context) (*DashboardResult, error)
}
