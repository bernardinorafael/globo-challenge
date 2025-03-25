package main

import (
	"context"
	"log"
	"log/slog"
	"time"

	"github.com/bernardinorafael/globo-challenge/internal/config"
	"github.com/bernardinorafael/globo-challenge/internal/modules/participant"
	"github.com/bernardinorafael/globo-challenge/internal/util"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	ctx := context.Background()

	// Environment variables
	env, err := config.NewEnv()
	if err != nil {
		log.Fatalf("error loading environment variables: %v", err)
	}

	// Database connection
	db, err := sqlx.Open("postgres", env.DSN)
	if err != nil {
		log.Fatalf("error opening database: %v", err)
	}
	defer db.Close()

	var participants = []participant.Entity{
		{ID: util.GenID("partic"), Name: "joão da silva", Picture: nil, EliminationID: nil, Created: time.Now(), Updated: time.Now()},
		{ID: util.GenID("partic"), Name: "maria oliveira", Picture: nil, EliminationID: nil, Created: time.Now(), Updated: time.Now()},
		{ID: util.GenID("partic"), Name: "pedro santos", Picture: nil, EliminationID: nil, Created: time.Now(), Updated: time.Now()},
		{ID: util.GenID("partic"), Name: "ana souza", Picture: nil, EliminationID: nil, Created: time.Now(), Updated: time.Now()},
		{ID: util.GenID("partic"), Name: "carlos pereira", Picture: nil, EliminationID: nil, Created: time.Now(), Updated: time.Now()},
		{ID: util.GenID("partic"), Name: "laura costa", Picture: nil, EliminationID: nil, Created: time.Now(), Updated: time.Now()},
	}

	_, err = db.NamedExecContext(
		ctx,
		`
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
			`,
		participants,
	)
	if err != nil {
		log.Fatalf("error inserting participants: %v", err)
	}

	slog.Info("Seed completed successfully")
}
