CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"role" varchar(50) NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	"created_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
