import { relations } from "drizzle-orm";
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

export const videosTable = pgTable('videos', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text().notNull(),
    userId: uuid('user_id').references(() => usersTable.id, {
        onDelete: 'cascade'
    }).notNull(),
    categoryId: uuid('category_id').references(() => categoriesTable.id, {
        onDelete: 'cascade'
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
},)

export const videoRelations = relations(videosTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [videosTable.userId],
        references: [usersTable.id]
    }),
    category: one(categoriesTable, {
        fields: [videosTable.categoryId],
        references: [categoriesTable.id]
    })
}))

export const userRelations = relations(usersTable, ({ many }) => ({
    videos: many(videosTable)
}))


export const categoryRelations = relations(videosTable, ({ many }) => ({
    videos: many(videosTable)
}))