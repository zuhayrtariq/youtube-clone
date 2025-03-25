import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema
} from 'drizzle-zod'
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

export const videosVisibility = pgEnum("video_visibility", [
    "private", "public"
])

export const videosTable = pgTable('videos', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text().notNull(),
    muxStatus: text("mux_status"),
    muxAssetId: text("mux_asset_id").unique(),
    muxUploadId: text('mux_upload_id').unique(),
    muxPlaybackId: text('mux_playback_id').unique(),
    muxTrackId: text('mux_track_id').unique(), //For subtitles
    muxTrackStatus: text('mux_track_status'),//For subtitles
    thumbnailUrl: text("thumbnail_url"),
    thumbnailKey: text("thumbnail_key"),
    previewUrl: text('preview_url'),
    previewKey: text('preview_key'),
    duration: integer().default(0).notNull(),
    visibility: videosVisibility().default('private').notNull(),

    userId: uuid('user_id').references(() => usersTable.id, {
        onDelete: 'cascade'
    }).notNull(),
    categoryId: uuid('category_id').references(() => categoriesTable.id, {
        onDelete: 'cascade'
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
},)

export const videoInsertSchema = createInsertSchema(videosTable)
export const videoUpdateSchema = createUpdateSchema(videosTable)
export const videoSelectSchema = createSelectSchema(videosTable)

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