DROP INDEX IF EXISTS "idx_votes_elimination";
DROP INDEX IF EXISTS "idx_votes_participant";

ALTER TABLE "votes"
	DROP CONSTRAINT IF EXISTS "fk_votes_user_id",
	DROP CONSTRAINT IF EXISTS "fk_votes_participant_id",
	DROP CONSTRAINT IF EXISTS "fk_votes_elimination_id";

ALTER TABLE "participants"
	DROP CONSTRAINT IF EXISTS "fk_participants_elimination_id";

DROP TABLE IF EXISTS "votes";
DROP INDEX IF EXISTS "idx_eliminations_open";
DROP TABLE IF EXISTS "eliminations";
DROP TABLE IF EXISTS "participants";
DROP TABLE IF EXISTS "users";
