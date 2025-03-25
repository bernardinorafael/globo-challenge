package elimination

import "time"

type Entity struct {
	ID        string    `json:"id" db:"id"`
	Open      bool      `json:"open" db:"open"`
	StartDate time.Time `json:"start_date" db:"start_date"`
	EndDate   time.Time `json:"end_date" db:"end_date"`
	Created   time.Time `json:"created" db:"created"`
	Updated   time.Time `json:"updated" db:"updated"`
}

type Vote struct {
	ID            string    `json:"id" db:"id"`
	UserID        string    `json:"user_id" db:"user_id"`
	EliminationID string    `json:"elimination_id" db:"elimination_id"`
	ParticipantID string    `json:"participant_id" db:"participant_id"`
	Created       time.Time `json:"created" db:"created"`
	Updated       time.Time `json:"updated" db:"updated"`
}

type Participant struct {
	ID   string `json:"id" db:"participant_id"`
	Name string `json:"name" db:"participant_name"`
}

type EntityWithParticipants struct {
	Entity
	Participants []Participant `json:"participants" db:"participants"`
}

type ParticipantResult struct {
	ID    string `json:"id" db:"id"`
	Name  string `json:"name" db:"name"`
	Count int    `json:"count" db:"count"`
}

type DashboardResult struct {
	TotalVotes     int     `json:"total_votes" db:"total_votes"`
	TotalUsers     int     `json:"total_users" db:"total_users"`
	VotesPerHour   float64 `json:"votes_per_hour" db:"votes_per_hour"`
	SpreadVotes    [24]int `json:"spread_votes" db:"spread_votes"`
	HasElimination bool    `json:"has_elimination" db:"has_elimination"`
}
