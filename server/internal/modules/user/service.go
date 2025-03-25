package user

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/bernardinorafael/globo-bbb-challenge/internal/infra/token"
	"github.com/bernardinorafael/globo-bbb-challenge/internal/shared/dto"
	"github.com/bernardinorafael/globo-bbb-challenge/internal/util"
	"github.com/bernardinorafael/globo-bbb-challenge/pkg/errs"
	"github.com/lib/pq"
)

type service struct {
	ctx       context.Context
	userRepo  Repository
	secretKey string
}

func NewService(ctx context.Context, userRepo Repository, secretKey string) Service {
	return &service{
		ctx:       ctx,
		userRepo:  userRepo,
		secretKey: secretKey,
	}
}

func (s *service) GetSignedUser(ctx context.Context, userId string) (*dto.UserResponse, error) {
	record, err := s.userRepo.GetByID(ctx, userId)
	if err != nil {
		return nil, errs.NewBadRequestError("failed to retrieve user", err)
	}
	if record == nil {
		return nil, errs.NewNotFoundError("user not found", nil)
	}

	user := dto.UserResponse{
		ID:      record.ID,
		Name:    record.Name,
		Email:   record.Email,
		Created: record.Created,
		Updated: record.Updated,
	}

	return &user, nil
}

func (s *service) Register(ctx context.Context, input dto.Register) error {
	// TODO: Implement a `Fields` property in the errors struct
	// to return the fields that are invalid
	user, err := NewUser(input.Name, input.Email, input.Password)
	if err != nil {
		return errs.NewUnprocessableEntityError(err.Error(), err)
	}

	if err := user.HashPassword(); err != nil {
		return errs.NewBadRequestError(err.Error(), err)
	}

	err = s.userRepo.Insert(ctx, user.Store())
	if err != nil {
		var pgErr *pq.Error
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			key := util.ParseKey(pgErr.Detail)
			return errs.NewConflictError(fmt.Sprintf("%s already taken", key), err)
		}
		return errs.NewBadRequestError("failed to insert user into database", err)
	}

	return nil
}

func (s *service) Login(ctx context.Context, input dto.Login) (*dto.LoginResponse, error) {
	record, err := s.userRepo.GetByEmail(ctx, input.Email)
	if err != nil {
		return nil, errs.NewBadRequestError("failed to retrieve user", err)
	}
	if record == nil {
		return nil, errs.NewForbiddenError(
			"email and/or password are incorrect",
			errs.InvalidCredentials,
			nil,
		)
	}

	user, err := NewUserFromDatabase(*record)
	if err != nil {
		return nil, errs.NewBadRequestError("failed to create user", err)
	}

	if !user.ComparePassword(input.Password) {
		return nil, errs.NewForbiddenError(
			"email and/or password are incorrect",
			errs.InvalidCredentials,
			nil,
		)
	}

	accessToken, claims, err := token.Generate(s.secretKey, user.ID(), user.Email(), time.Hour*24)
	if err != nil {
		return nil, errs.NewBadRequestError("failed to generate token", err)
	}

	res := dto.LoginResponse{
		UserID:      user.ID(),
		AccessToken: accessToken,
		Expires:     claims.ExpiresAt.Time,
	}

	return &res, nil
}
