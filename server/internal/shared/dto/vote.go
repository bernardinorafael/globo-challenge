package dto

type CreateVote struct {
	UserID        string `json:"user_id"`
	ParticipantID string `json:"participant_id"`
	EliminationID string `json:"elimination_id"`
}
