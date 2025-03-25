package user

import (
	"context"

	"github.com/bernardinorafael/globo-bbb-challenge/internal/shared/dto"
)

type Repository interface {
	Insert(ctx context.Context, user Entity) error
	Delete(ctx context.Context, userId string) error
	GetByID(ctx context.Context, userId string) (*Entity, error)
	GetByEmail(ctx context.Context, email string) (*Entity, error)
}

type Service interface {
	Register(ctx context.Context, input dto.Register) error
	Login(ctx context.Context, input dto.Login) (*dto.LoginResponse, error)
	GetSignedUser(ctx context.Context, userId string) (*dto.UserResponse, error)
}
