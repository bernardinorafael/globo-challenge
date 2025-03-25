package participant

import "time"

type Entity struct {
	ID            string    `json:"id" db:"id"`
	Name          string    `json:"name" db:"name"`
	Picture       *string   `json:"picture" db:"picture"`
	EliminationID *string   `json:"elimination_id" db:"elimination_id"`
	Created       time.Time `json:"created" db:"created"`
	Updated       time.Time `json:"updated" db:"updated"`
}
