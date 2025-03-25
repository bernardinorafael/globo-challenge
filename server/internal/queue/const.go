package queue

const (
	// MainExchangeName defines the central distribution point for BBB voting events
	// Format: <system>-<domain>-<type>
	MainExchangeName = "bbb_voting_events"
	// VotesCreatedKey defines the routing pattern for vote messages
	// Format: <entity>.<action>.<event>
	VotesCreatedKey = "votes.submission.created"
	// VotesQueueName defines the name of the votes queue
	VotesQueueName = "votes_queue"
)
