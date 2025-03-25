package elimination

import (
	"context"
	"encoding/json"
	"log/slog"

	"github.com/bernardinorafael/globo-bbb-challenge/internal/metric"
	"github.com/bernardinorafael/globo-bbb-challenge/internal/queue"
	"github.com/bernardinorafael/globo-bbb-challenge/pkg/errs"
)

type consumer struct {
	queue           *queue.Queue
	eliminationRepo Repository
	metrics         *metric.Metric
}

func NewConsumer(queue *queue.Queue, metrics *metric.Metric, eliminationRepo Repository) *consumer {
	return &consumer{
		queue:           queue,
		eliminationRepo: eliminationRepo,
		metrics:         metrics,
	}
}

func (c *consumer) Consume(ctx context.Context) error {
	messages, err := c.queue.Consume(queue.VotesQueueName)
	if err != nil {
		c.metrics.RecordError("queue_consume_error")
		return errs.NewBadRequestError("failed to consumed queue", err)
	}

	go func() {
		for {
			select {
			case <-ctx.Done():
				slog.Info("stopping votes consumer")
				return
			case msg := <-messages:
				var timer = c.metrics.ObserveVotingLatency("vote_processing")

				var v Vote
				_ = json.Unmarshal(msg.Body, &v)

				if err := c.eliminationRepo.InsertVote(ctx, v); err != nil {
					c.metrics.RecordError("database_insert_error")
					slog.Error("failed to insert vote", "error", err)
					timer.ObserveDuration()
					continue
				}

				c.metrics.RecordVote(v.ParticipantID, "processed")
				timer.ObserveDuration()
				slog.Info("vote inserted", "vote_id", v.ID)
			}
		}
	}()

	return nil
}
