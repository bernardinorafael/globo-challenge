package participant

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/jmoiron/sqlx"
)

type repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r repository) Update(ctx context.Context, participant Entity) error {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	_, err := r.db.NamedExecContext(
		ctx,
		`
		UPDATE participants SET
				name = :name,
				picture = :picture,
				elimination_id = :elimination_id,
				updated = :updated
			WHERE id = :id`,
		participant,
	)
	if err != nil {
		return fmt.Errorf("failed to update participant: %w", err)
	}

	return nil
}

func (r repository) Delete(ctx context.Context, participantId string) error {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	_, err := r.db.ExecContext(ctx, "DELETE FROM participants WHERE id = $1", participantId)
	if err != nil {
		return fmt.Errorf("failed to delete participant: %w", err)
	}

	return nil
}

func (r repository) GetAll(ctx context.Context) ([]Entity, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var participants = []Entity{}
	err := r.db.SelectContext(ctx, &participants, "SELECT * FROM participants ORDER BY created DESC")
	if err != nil {
		log.Println("failed to get all participants: %w", err)
		return nil, fmt.Errorf("failed to get all participants: %w", err)
	}

	return participants, nil
}

func (r repository) GetByName(ctx context.Context, name string) (*Entity, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var participant Entity
	err := r.db.GetContext(ctx, &participant, "SELECT * FROM participants WHERE name = $1", name)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get participant by id: %w", err)
	}

	return &participant, nil
}

func (r repository) GetByID(ctx context.Context, id string) (*Entity, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var participant Entity
	err := r.db.GetContext(ctx, &participant, "SELECT * FROM participants WHERE id = $1", id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get participant by id: %w", err)
	}

	return &participant, nil
}

func (r repository) Insert(ctx context.Context, participant Entity) error {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var query = `
		INSERT INTO participants (
			id,
			name,
			picture,
			elimination_id,
			created,
			updated
		) VALUES (
			:id,
			:name,
			:picture,
			:elimination_id,
			:created,
			:updated
		)
	`

	_, err := r.db.NamedExecContext(ctx, query, participant)
	if err != nil {
		return fmt.Errorf("failed to insert participant: %w", err)
	}

	return nil
}
