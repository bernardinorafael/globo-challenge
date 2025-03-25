package queue

import (
	"context"
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Queue struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	uri     string
}

func New(uri string) (*Queue, error) {
	conn, err := amqp.Dial(uri)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RabbitMQ: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("failed to create channel: %w", err)
	}

	queue := &Queue{conn: conn, channel: ch, uri: uri}

	if err := queue.declareExchange(); err != nil {
		return nil, fmt.Errorf("failed to declare exchange: %w", err)
	}
	if err := queue.declareQueues(); err != nil {
		return nil, fmt.Errorf("failed to declare queues: %w", err)
	}
	if err := queue.queueBind(VotesQueueName, VotesCreatedKey, MainExchangeName); err != nil {
		return nil, fmt.Errorf("failed to bind queue to exchange: %w", err)
	}

	return queue, nil
}

func (q *Queue) Publish(ctx context.Context, key string, message []byte) error {
	return q.channel.PublishWithContext(
		ctx,
		MainExchangeName, // exchange
		key,              // routing key
		false,            // mandatory
		false,            // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        message,
		},
	)
}

func (q *Queue) Consume(name string) (<-chan amqp.Delivery, error) {
	return q.channel.Consume(
		name,  // queue
		"",    // consumer
		true,  // auto-ack
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,   // args
	)
}

func (q *Queue) Close() error {
	if err := q.channel.Close(); err != nil {
		return fmt.Errorf("failed to close channel: %w", err)
	}

	if err := q.conn.Close(); err != nil {
		return fmt.Errorf("failed to close connection: %w", err)
	}

	return nil
}

func (q *Queue) declareQueues() error {
	queues := []string{VotesQueueName}

	for _, queue := range queues {
		_, err := q.channel.QueueDeclare(
			queue, // name
			true,  // durable
			false, // delete when unused
			false, // exclusive
			false, // no-wait
			nil,   // arguments
		)
		if err != nil {
			return fmt.Errorf("failed to declare queue: %w", err)
		}
	}

	return nil
}

func (q *Queue) declareExchange() error {
	return q.channel.ExchangeDeclare(
		MainExchangeName, // name
		"topic",          // type
		true,             // durable
		false,            // auto-delete
		false,            // internal
		false,            // no-wait
		nil,              // arguments
	)
}

func (q *Queue) queueBind(queueName, routingKey, exchangeName string) error {
	return q.channel.QueueBind(
		queueName,    // queue name
		routingKey,   // routing key
		exchangeName, // exchange
		false,        // no-wait
		nil,          // arguments
	)
}
