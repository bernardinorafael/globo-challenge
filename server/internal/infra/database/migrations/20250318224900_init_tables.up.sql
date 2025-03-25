CREATE TABLE
	IF NOT EXISTS "users" (
		"id" VARCHAR(255) PRIMARY KEY NOT NULL,
		"name" VARCHAR(255) NOT NULL,
		"email" VARCHAR(255) UNIQUE NOT NULL,
		"password" VARCHAR(255) NOT NULL,
		"created" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
		"updated" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
	);

CREATE TABLE IF NOT EXISTS "participants" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"picture" varchar(255) NULL,
	"elimination_id" varchar(255) NULL,
	"created" timestamptz NOT NULL DEFAULT now(),
	"updated" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "eliminations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"open" boolean NOT NULL DEFAULT TRUE,
	"start_date" timestamptz NOT NULL,
	"end_date" timestamptz NOT NULL,
	"created" timestamptz NOT NULL DEFAULT now(),
	"updated" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "votes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"elimination_id" varchar(255) NOT NULL,
	"participant_id" varchar(255) NOT NULL,
	"created" timestamptz NOT NULL DEFAULT now(),
	"updated" timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE "votes"
	ADD CONSTRAINT "fk_votes_elimination_id" FOREIGN KEY ("elimination_id") REFERENCES "eliminations" ("id") ON DELETE CASCADE;

ALTER TABLE "votes"
	ADD CONSTRAINT "fk_votes_participant_id" FOREIGN KEY ("participant_id") REFERENCES "participants" ("id") ON DELETE CASCADE;

ALTER TABLE "votes"
	ADD CONSTRAINT "fk_votes_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;

ALTER TABLE "participants"
	ADD CONSTRAINT "fk_participants_elimination_id" FOREIGN KEY ("elimination_id") REFERENCES "eliminations" ("id") ON DELETE CASCADE;

CREATE INDEX "idx_votes_participant" ON votes ("participant_id");
CREATE INDEX "idx_votes_elimination" ON votes ("elimination_id");
CREATE INDEX "idx_eliminations_open" ON eliminations (OPEN);
