package user

import (
	"errors"
	"fmt"
	"regexp"
	"time"

	"github.com/bernardinorafael/globo-challenge/internal/util"
	"github.com/bernardinorafael/globo-challenge/pkg/crypto"
)

const (
	minNameLength     = 3
	minPasswordLength = 4
)

// user is the internal representation of the user entity
type user struct {
	id       string
	name     string
	email    string
	password string
	created  time.Time
	updated  time.Time
}

// NewUserFromDatabase creates a new user entity from a database entity
func NewUserFromDatabase(entity Entity) (*user, error) {
	u := &user{
		id:       entity.ID,
		name:     entity.Name,
		email:    entity.Email,
		password: entity.Password,
		created:  entity.Created,
		updated:  entity.Updated,
	}

	if err := u.validate(); err != nil {
		return nil, err
	}

	return u, nil
}

// NewUser creates a new user entity
func NewUser(name, email, password string) (*user, error) {
	u := &user{
		id:       util.GenID("user"),
		name:     name,
		email:    email,
		password: password,
		created:  time.Now(),
		updated:  time.Now(),
	}

	if err := u.validate(); err != nil {
		return nil, err
	}

	return u, nil
}

// TODO: if there is time left, use govalidator to validate the user
func (u *user) validate() error {
	if u.name == "" {
		return errors.New("name is required")
	}
	if u.email == "" {
		return errors.New("email is required")
	}

	if len(u.name) < minNameLength {
		return fmt.Errorf("name must be at least %d characters long", minNameLength)
	}
	if len(u.password) < minPasswordLength {
		return fmt.Errorf("password must be at least %d characters long", minPasswordLength)
	}

	pattern := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	if !pattern.MatchString(u.email) {
		return errors.New("email format is invalid")
	}

	return nil
}

func (u *user) ComparePassword(password string) bool {
	return crypto.PasswordMatches(password, u.password)
}

func (u *user) HashPassword() error {
	hashed, err := crypto.HashPassword(u.password)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}
	u.password = hashed

	return nil
}

// Store returns the user entity in a format that can be stored in the database
func (u *user) Store() Entity {
	return Entity{
		ID:       u.id,
		Name:     u.name,
		Email:    u.email,
		Password: u.password,
		Created:  u.created,
		Updated:  u.updated,
	}
}

func (u *user) ID() string         { return u.id }
func (u *user) Name() string       { return u.name }
func (u *user) Email() string      { return u.email }
func (u *user) Password() string   { return u.password }
func (u *user) Created() time.Time { return u.created }
func (u *user) Updated() time.Time { return u.updated }
