package elimination

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/bernardinorafael/globo-bbb-challenge/internal/util"
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

func (r repository) GetVotesByEliminationID(ctx context.Context, eliminationId string) ([]Vote, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var votes []Vote
	err := r.db.SelectContext(ctx, &votes, "SELECT * FROM votes WHERE elimination_id = $1", eliminationId)
	if err != nil {
		return nil, fmt.Errorf("failed to get votes: %w", err)
	}

	return votes, nil
}

func (r repository) GetUniqueOpen(ctx context.Context) (*Entity, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var elimination Entity
	err := r.db.GetContext(ctx, &elimination, "SELECT * FROM eliminations WHERE open = true LIMIT 1")
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get unique open elimination: %w", err)
	}

	return &elimination, nil
}

func (r repository) GetTotalUsers(ctx context.Context) (int, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var query = `
		SELECT
			COUNT(DISTINCT v.user_id) AS "total_users"
		FROM votes v
		LEFT JOIN eliminations e ON e.id = v.elimination_id
		WHERE e.open = true
	`

	var result int
	err := r.db.GetContext(ctx, &result, query)
	if err != nil {
		return -1, fmt.Errorf("failed to get total users: %w", err)
	}

	return result, nil
}

func (r repository) GetTotalVotes(ctx context.Context) (int, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var query = `
		SELECT
			COUNT(v.id) AS "total_votes"
		FROM votes v
		LEFT JOIN eliminations e ON e.id = v.elimination_id
		WHERE e.open = true
	`

	var result int
	err := r.db.GetContext(ctx, &result, query)
	if err != nil {
		return -1, fmt.Errorf("failed to get total votes: %w", err)
	}

	return result, nil
}

func (r repository) FinishElimination(ctx context.Context, eliminationId string, participants []string) error {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	err := util.ExecTx(ctx, r.db, func(tx *sqlx.Tx) error {
		var query = `
			UPDATE eliminations SET
				open = false,
				updated = now()
			WHERE id = $1 AND open = true
		`

		_, err := tx.ExecContext(ctx, query, eliminationId)
		if err != nil {
			return fmt.Errorf("failed to update elimination: %w", err)
		}

		for _, participantId := range participants {
			var query = `
				UPDATE participants SET
					elimination_id = null,
					updated = now()
				WHERE id = $1
			`

			_, err := tx.ExecContext(ctx, query, participantId)
			if err != nil {
				return fmt.Errorf("failed to update participant: %w", err)
			}
		}

		return nil
	})
	if err != nil {
		return fmt.Errorf("failed to finish elimination: %w", err)
	}

	return nil
}

func (r repository) GetResult(ctx context.Context, eliminationId string) ([]ParticipantResult, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var participants []ParticipantResult

	var query = `
		SELECT
			p.id AS "id",
			p.name AS "name",
			COUNT(v.id) AS "count"
		FROM participants p
		LEFT JOIN votes v ON p.id = v.participant_id AND v.elimination_id = $1
		WHERE p.elimination_id = $1
		GROUP BY p.id, p.name
		ORDER BY COUNT(v.id) DESC
	`

	err := r.db.SelectContext(ctx, &participants, query, eliminationId)
	if err != nil {
		return nil, fmt.Errorf("failed to get votes: %w", err)
	}

	return participants, nil
}

func (r repository) InsertVote(ctx context.Context, vote Vote) error {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var query = `
		INSERT INTO votes (
			id,
			user_id,
			participant_id,
			elimination_id,
			created
		) VALUES (
			:id,
			:user_id,
			:participant_id,
			:elimination_id,
			:created
		)
	`

	_, err := r.db.NamedExecContext(ctx, query, vote)
	if err != nil {
		return fmt.Errorf("failed to insert vote: %w", err)
	}

	return nil
}

// TODO: Refactor the methods for fetching eliminations
// use a boolean variable and use the same method
// to fetch all eliminations or only the open eliminations

func (r repository) GetAll(ctx context.Context) ([]EntityWithParticipants, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var query = `
		SELECT
			e.id,
			e.open,
			e.start_date,
			e.end_date,
			e.created,
			e.updated,
			COALESCE(
				json_agg(
					json_build_object('id', p.id, 'name', p.name)
				) FILTER (WHERE p.id IS NOT NULL)
			) AS participants
		FROM
			eliminations e
			LEFT JOIN participants p ON p.elimination_id = e.id
		GROUP BY
			e.id,
			e.open,
			e.start_date,
			e.end_date,
			e.created,
			e.updated
		ORDER BY e.created DESC
	`

	var rows []struct {
		ID           string    `db:"id"`
		Open         bool      `db:"open"`
		StartDate    time.Time `db:"start_date"`
		EndDate      time.Time `db:"end_date"`
		Created      time.Time `db:"created"`
		Updated      time.Time `db:"updated"`
		Participants []byte    `db:"participants"`
	}
	err := r.db.SelectContext(ctx, &rows, query)
	if err != nil {
		return nil, fmt.Errorf("failed to get eliminations: %w", err)
	}

	var eliminations []EntityWithParticipants
	for _, r := range rows {
		var participants = []Participant{}

		_ = json.Unmarshal(r.Participants, &participants)

		eliminations = append(eliminations, EntityWithParticipants{
			Entity: Entity{
				ID:        r.ID,
				Open:      r.Open,
				StartDate: r.StartDate,
				EndDate:   r.EndDate,
				Created:   r.Created,
				Updated:   r.Updated,
			},
			Participants: participants,
		})
	}

	return eliminations, nil
}

func (r repository) GetByIDWithParticipants(ctx context.Context, eliminationId string) (*EntityWithParticipants, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var query = `
		SELECT
			e.id,
			e.open,
			e.start_date,
			e.end_date,
			e.created,
			e.updated,
			COALESCE(
				json_agg(
					json_build_object('id', p.id, 'name', p.name)
				) FILTER (WHERE p.id IS NOT NULL)
			) AS participants
		FROM
			eliminations e
			LEFT JOIN participants p ON p.elimination_id = e.id
		WHERE e.id = $1
		GROUP BY
			e.id,
			e.open,
			e.start_date,
			e.end_date,
			e.created,
			e.updated
	`

	var row struct {
		ID           string    `db:"id"`
		Open         bool      `db:"open"`
		StartDate    time.Time `db:"start_date"`
		EndDate      time.Time `db:"end_date"`
		Created      time.Time `db:"created"`
		Updated      time.Time `db:"updated"`
		Participants []byte    `db:"participants"`
	}

	err := r.db.GetContext(ctx, &row, query, eliminationId)
	if err != nil {
		return nil, fmt.Errorf("failed to get eliminations: %w", err)
	}

	var participants = []Participant{}
	_ = json.Unmarshal(row.Participants, &participants)

	return &EntityWithParticipants{
		Entity: Entity{
			ID:        row.ID,
			Open:      row.Open,
			StartDate: row.StartDate,
			EndDate:   row.EndDate,
			Created:   row.Created,
			Updated:   row.Updated,
		},
		Participants: participants,
	}, nil
}

func (r repository) GetAllOpen(ctx context.Context) ([]EntityWithParticipants, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var query = `
		SELECT
			e.id,
			e.open,
			e.start_date,
			e.end_date,
			e.created,
			e.updated,
			COALESCE(
				json_agg(
					json_build_object('id', p.id, 'name', p.name)
				) FILTER (WHERE p.id IS NOT NULL)
			) AS participants
		FROM
			eliminations e
			LEFT JOIN participants p ON p.elimination_id = e.id
		WHERE e.open = true
		GROUP BY
			e.id,
			e.open,
			e.start_date,
			e.end_date,
			e.created,
			e.updated
		ORDER BY e.created DESC
	`

	var rows []struct {
		ID           string    `db:"id"`
		Open         bool      `db:"open"`
		StartDate    time.Time `db:"start_date"`
		EndDate      time.Time `db:"end_date"`
		Created      time.Time `db:"created"`
		Updated      time.Time `db:"updated"`
		Participants []byte    `db:"participants"`
	}
	err := r.db.SelectContext(ctx, &rows, query)
	if err != nil {
		return nil, fmt.Errorf("failed to get eliminations: %w", err)
	}

	var eliminations []EntityWithParticipants
	for _, r := range rows {
		var participants = []Participant{}

		_ = json.Unmarshal(r.Participants, &participants)

		eliminations = append(eliminations, EntityWithParticipants{
			Entity: Entity{
				ID:        r.ID,
				Open:      r.Open,
				StartDate: r.StartDate,
				EndDate:   r.EndDate,
				Created:   r.Created,
				Updated:   r.Updated,
			},
			Participants: participants,
		})
	}

	return eliminations, nil
}

func (r repository) GetByID(ctx context.Context, eliminationId string) (*Entity, error) {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var elimination Entity
	err := r.db.GetContext(ctx, &elimination, "SELECT * FROM eliminations WHERE id = $1", eliminationId)
	if err != nil {
		return nil, fmt.Errorf("failed to get elimination: %w", err)
	}

	return &elimination, nil
}

func (r repository) Insert(ctx context.Context, elimination Entity) error {
	ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	var query = `
		INSERT INTO eliminations (
	    id,
			open,
			start_date,
			end_date,
			created,
			updated
		) VALUES (
	    :id,
			:open,
			:start_date,
			:end_date,
			:created,
			:updated
		)
	`

	_, err := r.db.NamedExecContext(ctx, query, elimination)
	if err != nil {
		return fmt.Errorf("failed to insert elimination: %w", err)
	}

	return nil
}
