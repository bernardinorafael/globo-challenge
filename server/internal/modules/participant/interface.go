package participant

import "context"

type Repository interface {
	Insert(ctx context.Context, participant Entity) error
	GetByID(ctx context.Context, participantId string) (*Entity, error)
	GetByName(ctx context.Context, name string) (*Entity, error)
	GetAll(ctx context.Context) ([]Entity, error)
	Delete(ctx context.Context, participantId string) error
	Update(ctx context.Context, participant Entity) error
}

type Service interface {
	CreateParticipant(ctx context.Context, name string) error
	GetAllParticipants(ctx context.Context) ([]Entity, error)
	DeleteParticipant(ctx context.Context, participantId string) error
	AssignElimination(ctx context.Context, participantId string, eliminationId string) error
}
