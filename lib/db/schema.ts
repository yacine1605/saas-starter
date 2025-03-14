import { SQL, sql } from "drizzle-orm";
import {
  integer,
  pgPolicy,
  pgRole,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  check,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

//export const users = pgTable("users", {
//  id: integer("id").primaryKey(),
//  name: varchar("name", { length: 100 }),
//  email: varchar("email", { length: 255 }).notNull().unique(),
//  passwordHash: text("password_hash").notNull(),
//  role: varchar("role", { length: 20 }).notNull().default("member"),
//  createdAt: timestamp("created_at").notNull().defaultNow(),
//  updatedAt: timestamp("updated_at").notNull().defaultNow(),
//  deletedAt: timestamp("deleted_at"),
//});
export const admin_role = pgRole("admin_role");
export const web_insert = pgRole("web_insert");

export const UtilisateurTable = pgTable(
  "utilisateur",
  {
    id: integer().generatedAlwaysAsIdentity().notNull(),
    nom: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).unique().notNull(),
    commune: varchar({ length: 255 }).notNull(),
    ilot: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 10 }).unique().notNull(),
    adresse: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    code_client: varchar({ length: 9 }).primaryKey().notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    // uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
    uniqueIndex("emailUniqueIndex").on(lower(table.email)),
    pgPolicy("policy", {
      as: "permissive",
      to: web_insert,
      for: "insert",
    }),
  ]
).enableRLS();

export const sessionsUtilisateur = pgTable("sessions", {
  userId: varchar("code_client")
    .notNull()
    .references(() => UtilisateurTable.code_client, { onDelete: "cascade" }),

  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});
export const livreurTable = pgTable("livreur", {
  id: integer("id").primaryKey(),
  nomComplet: text().notNull(),
  phone: text().notNull(),
});
export const facturesTable = pgTable(
  "factures",
  {
    id: integer("id").primaryKey(),
    utiliateurId: text("client_code")
      .notNull()
      .references(() => UtilisateurTable.code_client, { onDelete: "cascade" }),
    montant: integer("montant").notNull(),
    livreurNom: text("livrer_par")
      .notNull()
      .references(() => livreurTable.nomComplet),
    DemandeAt: timestamp("demander_a").notNull().defaultNow(),
    status: varchar("status", { length: 20 }).notNull().default("non payé"),
  },
  (table) => [check("montant", sql`${table.montant} > 0`)]
);

export const accountTable = pgTable("account", {
  id: integer("id").primaryKey(),
  accountId: text("account_id").notNull(),
  userId: text("Utilisateur_code")
    .notNull()
    .references(() => UtilisateurTable.code_client, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull(),
});
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
export const lower = (email: AnyPgColumn): SQL => {
  return sql`lower(${email})`;
};

/**
 *-********************** exported types ***************** /
 */

export type User = typeof UtilisateurTable.$inferSelect;
export type NvUser = typeof UtilisateurTable.$inferInsert;
export type Livreur = typeof livreurTable.$inferSelect;
export type NvLivreur = typeof livreurTable.$inferInsert;
export type NvAccount = typeof accountTable.$inferInsert;
export type Account = typeof accountTable.$inferSelect;
export type NvFacteur = typeof facturesTable.$inferInsert;
export type Factures = typeof facturesTable.$inferSelect;
export type SessionsUtilisateur = typeof sessionsUtilisateur.$inferSelect;

/*
 *************************** Admin Portal *************************************
 */

export const AdminTable = pgTable("admin", {
  id: integer().generatedAlwaysAsIdentity().notNull(),
  email: varchar({ length: 255 }).primaryKey(),
  password: varchar({ length: 255 }).notNull(),
});
export const accountAdminTable = pgTable("account", {
  id: integer("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("Utilisateur_code")
    .notNull()
    .references(() => AdminTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});
//****************************Admin Portal **************************************/
/**
 ************** Les differents  relations ***********************************  /
 */
export const UtilisateurRelation = relations(UtilisateurTable, ({ many }) => ({
  factures_demander: many(facturesTable),
}));
export const FacturesRelations = relations(facturesTable, ({ one }) => ({
  team: one(UtilisateurTable, {
    fields: [facturesTable.utiliateurId],
    references: [UtilisateurTable.code_client],
  }),
  livreur: one(livreurTable, {
    fields: [facturesTable.livreurNom],
    references: [livreurTable.nomComplet],
  }),
}));
/************** Les differents  relations ***********************************  */
