import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: varchar({ length: 255 }).notNull(),
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const categoriesTable = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar({ length: 255 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("name").on(t.name)]
);

export const videosVisibility = pgEnum("video_visibility", [
  "private",
  "public",
]);

export const videosTable = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text().notNull(),
  views: integer().default(0).notNull(),
  muxStatus: text("mux_status"),
  muxAssetId: text("mux_asset_id").unique(),
  muxUploadId: text("mux_upload_id").unique(),
  muxPlaybackId: text("mux_playback_id").unique(),
  muxTrackId: text("mux_track_id").unique(), //For subtitles
  muxTrackStatus: text("mux_track_status"), //For subtitles
  thumbnailUrl: text("thumbnail_url"),
  thumbnailKey: text("thumbnail_key"),
  previewUrl: text("preview_url"),
  previewKey: text("preview_key"),
  duration: integer().default(0).notNull(),
  visibility: videosVisibility().default("private").notNull(),

  userId: uuid("user_id")
    .references(() => usersTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: uuid("category_id").references(() => categoriesTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoInsertSchema = createInsertSchema(videosTable);
export const videoUpdateSchema = createUpdateSchema(videosTable);
export const videoSelectSchema = createSelectSchema(videosTable);

export const videoRelations = relations(videosTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [videosTable.userId],
    references: [usersTable.id],
  }),
  category: one(categoriesTable, {
    fields: [videosTable.categoryId],
    references: [categoriesTable.id],
  }),
  views: many(videoViews),
  reactions: many(videoReactions),

  comments: many(commentsTable),
}));

export const videoViews = pgTable(
  "video_views",
  {
    userId: uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videosTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_views_pk",
      columns: [t.userId, t.videoId],
    }),
  ]
);

export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);

export const videoReactions = pgTable(
  "video_reactions",
  {
    userId: uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    videoId: uuid("video_id")
      .references(() => videosTable.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "video_reactions_pk",
      columns: [t.userId, t.videoId],
    }),
  ]
);

export const videoViewRelations = relations(videoViews, ({ one }) => ({
  user: one(usersTable, {
    fields: [videoViews.userId],
    references: [usersTable.id],
  }),
  video: one(videosTable, {
    fields: [videoViews.videoId],
    references: [videosTable.id],
  }),
}));
export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);
export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoReactionRelations = relations(videoReactions, ({ one }) => ({
  user: one(usersTable, {
    fields: [videoReactions.userId],
    references: [usersTable.id],
  }),
  video: one(videosTable, {
    fields: [videoReactions.videoId],
    references: [videosTable.id],
  }),
}));

export const videoReactionInsertSchema = createInsertSchema(videoReactions);
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions);
export const videoReactionSelectSchema = createSelectSchema(videoReactions);

export const userRelations = relations(usersTable, ({ many }) => ({
  videos: many(videosTable),
  videoViews: many(videoViews),
  videoReactions: many(videoReactions),
  subscribers: many(subscriptionsTable, {
    relationName: "subscriptions_creator_id_fk",
  }),
  subscriptions: many(subscriptionsTable, {
    relationName: "subscriptions_viewer_id_fk",
  }),
  comments: many(commentsTable),
  commentReactions: many(commentReactions),
}));

export const categoryRelations = relations(videosTable, ({ many }) => ({
  videos: many(videosTable),
}));

export const subscriptionsTable = pgTable(
  "subscriptions",
  {
    viewerId: uuid("viewer_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    creatorId: uuid("creator_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "subscriptions_pk",
      columns: [t.viewerId, t.creatorId],
    }),
  ]
);

export const subscriptionsRelations = relations(
  subscriptionsTable,
  ({ one }) => ({
    viewerId: one(usersTable, {
      fields: [subscriptionsTable.viewerId],
      references: [usersTable.id],
      relationName: "subscriptions_viewer_id_fk",
    }),
    creatorId: one(usersTable, {
      fields: [subscriptionsTable.creatorId],
      references: [usersTable.id],

      relationName: "subscriptions_creator_id_fk",
    }),
  })
);

export const subscriptionsInsertSchema = createInsertSchema(subscriptionsTable);
export const subscriptionsUpdateSchema = createUpdateSchema(subscriptionsTable);
export const subscriptionsSelectSchema = createSelectSchema(subscriptionsTable);

export const commentsTable = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    parentId: uuid("parent_id"),
    videoId: uuid("video_id")
      .references(() => videosTable.id, { onDelete: "cascade" })
      .notNull(),
    value: text().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "comments_parent_id_fk",
    }).onDelete("cascade"),
  ]
);

export const commentsRelations = relations(commentsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [commentsTable.userId],
    references: [usersTable.id],
  }),
  video: one(videosTable, {
    fields: [commentsTable.videoId],
    references: [videosTable.id],
  }),

  parent: one(commentsTable, {
    fields: [commentsTable.parentId],
    references: [commentsTable.id],
    relationName: "comments_parent_id_fk",
  }),
  reactions: many(commentReactions),
  replies: many(commentsTable, {
    relationName: "comments_parent_id_fk",
  }),
}));

export const commentInsertSchema = createInsertSchema(commentsTable);
export const commentUpdateSchema = createUpdateSchema(commentsTable);
export const commentSelectSchema = createSelectSchema(commentsTable);

export const commentReactions = pgTable(
  "comment_reactions",
  {
    userId: uuid("user_id")
      .references(() => usersTable.id, { onDelete: "cascade" })
      .notNull(),
    commentId: uuid("comment_id")
      .references(() => commentsTable.id, { onDelete: "cascade" })
      .notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({
      name: "comment_reactions_pk",
      columns: [t.userId, t.commentId],
    }),
  ]
);

export const commentReactionRelations = relations(
  commentReactions,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [commentReactions.userId],
      references: [usersTable.id],
    }),
    comment: one(commentsTable, {
      fields: [commentReactions.commentId],
      references: [commentsTable.id],
    }),
  })
);

export const commentReactionInsertSchema = createInsertSchema(commentReactions);
export const commentReactionUpdateSchema = createUpdateSchema(commentReactions);
export const commentReactionSelectSchema = createSelectSchema(commentReactions);
