package main

import (
	"context"
	"log"
	"log/slog"
	"net/http"

	"github.com/bernardinorafael/globo-challenge/internal/config"
	"github.com/bernardinorafael/globo-challenge/internal/metric"
	"github.com/bernardinorafael/globo-challenge/internal/modules/elimination"
	"github.com/bernardinorafael/globo-challenge/internal/modules/participant"
	"github.com/bernardinorafael/globo-challenge/internal/modules/user"
	"github.com/bernardinorafael/globo-challenge/internal/queue"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func main() {
	metrics := metric.NewMetric()
	ctx := context.Background()

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Handle("/metrics", promhttp.HandlerFor(metrics.GetRegistry(), promhttp.HandlerOpts{}))

	// Environment variables
	env, err := config.NewEnv()
	if err != nil {
		log.Fatalf("error loading environment variables: %v", err)
	}

	// RabbitMQ connection
	rmq, err := queue.New(env.RabbitMQURI)
	if err != nil {
		log.Fatalf("error creating queue: %v", err)
	}
	defer rmq.Close()
	slog.Info("rabbitmq connected")

	// Database connection
	db, err := sqlx.Open("postgres", env.DSN)
	if err != nil {
		log.Fatalf("error opening database: %v", err)
	}
	defer db.Close()
	slog.Info("database connected")

	// User module
	userRepo := user.NewRepository(db)
	userService := user.NewService(ctx, userRepo, env.SecretKey)
	user.NewController(userService, env.SecretKey).RegisterRoutes(r)

	// Participant module
	participantRepo := participant.NewRepository(db)
	participantService := participant.NewService(ctx, participantRepo)
	participant.NewController(participantService, env.SecretKey).RegisterRoutes(r)

	// Elimination module
	eliminationRepo := elimination.NewRepository(db)
	eliminationService := elimination.NewService(ctx, eliminationRepo, participantService, rmq, metrics)
	elimination.NewController(eliminationService, env.SecretKey).RegisterRoutes(r)

	// Consumers
	votesConsumer := elimination.NewConsumer(rmq, metrics, eliminationRepo)
	if err := votesConsumer.Consume(ctx); err != nil {
		log.Fatalf("error starting votes consumer: %v", err)
	}

	slog.Info("server started", "port", env.Port)
	if err := http.ListenAndServe(":"+env.Port, r); err != nil {
		log.Fatalf("error starting server: %v", err)
	}
}
