import { integer, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: varchar({ length: 255 }).notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [uniqueIndex('clerk_id_idx').on(t.clerkId)]);


export const categoriesTable = pgTable("categories", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => [uniqueIndex('name').on(t.name)])