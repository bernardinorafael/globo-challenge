package participant

import (
	"errors"
	"fmt"
	"time"

	"github.com/bernardinorafael/globo-bbb-challenge/internal/util"
)

const (
	minNameLength = 3
)

// participant is the internal representation of the participant entity
type participant struct {
	id            string
	name          string
	picture       *string
	eliminationID *string
	created       time.Time
	updated       time.Time
}

func NewParticipantFromDatabase(entity Entity) (*participant, error) {
	return &participant{
		id:            entity.ID,
		name:          entity.Name,
		picture:       entity.Picture,
		eliminationID: entity.EliminationID,
		created:       entity.Created,
		updated:       entity.Updated,
	}, nil
}

// NewParticipant creates a new participant entity
func NewParticipant(name string) (*participant, error) {
	p := participant{
		id:            util.GenID("partic"),
		name:          name,
		picture:       nil,
		eliminationID: nil,
		created:       time.Now(),
		updated:       time.Now(),
	}

	if err := p.validate(); err != nil {
		return nil, err
	}

	return &p, nil
}

// validate validates the participant entity
func (p *participant) validate() error {
	if p.name == "" {
		return errors.New("name is required")
	}

	if len(p.name) < minNameLength {
		return fmt.Errorf("name must be at least %d characters long", minNameLength)
	}

	return nil
}

func (p *participant) SetElimination(eliminationID string) {
	p.eliminationID = &eliminationID
	p.updated = time.Now()
}

// Store returns the participant entity in a format that can be stored in the database
func (p *participant) Store() Entity {
	return Entity{
		ID:            p.id,
		Name:          p.name,
		Picture:       p.picture,
		EliminationID: p.eliminationID,
		Created:       p.created,
		Updated:       p.updated,
	}
}

func (p *participant) ID() string             { return p.id }
func (p *participant) Name() string           { return p.name }
func (p *participant) Picture() *string       { return p.picture }
func (p *participant) EliminationID() *string { return p.eliminationID }
func (p *participant) Created() time.Time     { return p.created }
func (p *participant) Updated() time.Time     { return p.updated }
