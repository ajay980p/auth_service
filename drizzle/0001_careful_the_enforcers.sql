CREATE TABLE IF NOT EXISTS "tenants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT current_timestamp,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "tenants_name_unique" UNIQUE("name")
);
