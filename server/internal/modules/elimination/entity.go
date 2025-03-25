package elimination

import (
	"time"

	"github.com/bernardinorafael/globo-challenge/internal/util"
)

const (
	// TODO: Implement start and end date dynamically
	eliminationDuration = time.Hour * 24 * 1 // 1 day
)

// elimination is the internal representation of the elimination entity
type elimination struct {
	id        string
	open      bool
	startDate time.Time
	endDate   time.Time
	created   time.Time
	updated   time.Time
}

// NewEliminationFromDatabase creates a new elimination entity from a database entity
func NewEliminationFromDatabase(entity Entity) *elimination {
	return &elimination{
		id:        entity.ID,
		open:      entity.Open,
		startDate: entity.StartDate,
		endDate:   entity.EndDate,
		created:   entity.Created,
		updated:   entity.Updated,
	}
}

// NewElimination creates a new elimination entity
func NewElimination() *elimination {
	return &elimination{
		id:        util.GenID("elim"),
		open:      true,
		startDate: time.Now(),
		endDate:   time.Now().Add(eliminationDuration),
		created:   time.Now(),
		updated:   time.Now(),
	}
}

// Finish closes the elimination
func (e *elimination) Finish() {
	e.open = false
	e.updated = time.Now()
}

// Store returns the elimination entity in a format that can be stored in the database
func (e *elimination) Store() Entity {
	return Entity{
		ID:        e.id,
		Open:      e.open,
		StartDate: e.startDate,
		EndDate:   e.endDate,
		Created:   e.created,
		Updated:   e.updated,
	}
}

func (e *elimination) ID() string           { return e.id }
func (e *elimination) Open() bool           { return e.open }
func (e *elimination) StartDate() time.Time { return e.startDate }
func (e *elimination) EndDate() time.Time   { return e.endDate }
func (e *elimination) Created() time.Time   { return e.created }
func (e *elimination) Updated() time.Time   { return e.updated }
