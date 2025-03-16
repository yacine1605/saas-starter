CREATE TYPE "public"."status" AS ENUM('non payé', 'payed');--> statement-breakpoint
CREATE ROLE "admin_role";--> statement-breakpoint
CREATE ROLE "web_insert";--> statement-breakpoint
CREATE TABLE "admin" (
	"id" integer GENERATED ALWAYS AS IDENTITY (sequence name "admin_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"password" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "utilisateur" (
	"id" integer GENERATED ALWAYS AS IDENTITY (sequence name "utilisateur_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nom" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"commune" varchar(255) NOT NULL,
	"ilot" varchar(255) NOT NULL,
	"phone" varchar(10) NOT NULL,
	"adresse" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"code_client" varchar(9) PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "utilisateur_email_unique" UNIQUE("email"),
	CONSTRAINT "utilisateur_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "utilisateur" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "account" (
	"id" integer PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"Utilisateur_code" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "factures" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "factures_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_code" text NOT NULL,
	"montant" numeric NOT NULL,
	"livrer_par" integer NOT NULL,
	"demander_a" timestamp DEFAULT now() NOT NULL,
	"status" "status" DEFAULT 'non payé',
	CONSTRAINT "montant" CHECK ("factures"."montant" > 0)
);
--> statement-breakpoint
CREATE TABLE "livreur" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "livreur_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nomComplet" text NOT NULL,
	"phone" text NOT NULL,
	CONSTRAINT "livreur_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"code_client" varchar NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_Utilisateur_code_utilisateur_code_client_fk" FOREIGN KEY ("Utilisateur_code") REFERENCES "public"."utilisateur"("code_client") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factures" ADD CONSTRAINT "factures_client_code_utilisateur_code_client_fk" FOREIGN KEY ("client_code") REFERENCES "public"."utilisateur"("code_client") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "factures" ADD CONSTRAINT "factures_livrer_par_livreur_id_fk" FOREIGN KEY ("livrer_par") REFERENCES "public"."livreur"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_code_client_utilisateur_code_client_fk" FOREIGN KEY ("code_client") REFERENCES "public"."utilisateur"("code_client") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "emailUniqueIndex" ON "utilisateur" USING btree (lower("email"));--> statement-breakpoint
CREATE POLICY "policy" ON "utilisateur" AS PERMISSIVE FOR INSERT TO "web_insert";