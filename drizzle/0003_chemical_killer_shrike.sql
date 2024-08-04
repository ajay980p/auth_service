CREATE TABLE IF NOT EXISTS "refreshTokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"expiresAt" timestamp NOT NULL,
	"created_at" timestamp DEFAULT current_timestamp,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
