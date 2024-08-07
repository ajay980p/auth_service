CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"tenantId" integer,
	"role" varchar(50) NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	"created_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "users_firstName_unique" UNIQUE("firstName"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenants" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"address" varchar(100) NOT NULL,
	"mailId" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT current_timestamp,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "tenants_name_unique" UNIQUE("name"),
	CONSTRAINT "tenants_mailId_unique" UNIQUE("mailId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "refreshTokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"refreshToken" varchar(500) NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"created_at" timestamp DEFAULT current_timestamp,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "refreshTokens" ADD CONSTRAINT "refreshTokens_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
