import { db } from "@/db";
import { z } from 'zod'
import { usersTable, videoReactions, videosTable, videoViews, } from "@/db/schema";
import { createTRPCRouter, protectedProcedure, } from "@/trpc/init";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";


export const playlistsRouter = createTRPCRouter({



    getHistory: protectedProcedure.input(
        z.object({
            cursor: z.object({
                id: z.string().uuid(),
                viewedAt: z.date(),
            })
                .nullish(),
            limit: z.number().min(1).max(100),
        })
    ).query(async ({ input, ctx }) => {
        const { limit, cursor } = input
        const { id: userId } = ctx.user;
        const viewerVideoViews = db.$with('viewer_video_views').as(
            db.select(
                {
                    videoId: videoViews.videoId,
                    viewedAt: videoViews.updatedAt
                }
            ).from(videoViews).where(
                eq(videoViews.userId, userId)
            )
        );
        const data = await db.with(viewerVideoViews).
            select(
                {
                    ...getTableColumns(videosTable),
                    user: usersTable,
                    viewedAt: viewerVideoViews.viewedAt,
                    // viewCount : db.$count(videoViews.videoId,videosTable.id),
                    likeCount: db.$count(videoReactions,
                        and(
                            eq(videoReactions.videoId, videosTable.id),
                            eq(videoReactions.type, 'like')
                        )
                    ),
                    dislikeCount: db.$count(videoReactions,
                        and(
                            eq(videoReactions.videoId, videosTable.id),
                            eq(videoReactions.type, 'dislike')
                        )
                    )
                }

            ).from(videosTable)
            .innerJoin(usersTable, eq(videosTable.userId, usersTable.id))
            .innerJoin(viewerVideoViews, eq(videosTable.id, viewerVideoViews.videoId))
            .where(and(
                eq(videosTable.visibility, 'public'),
                cursor ? or(lt(viewerVideoViews.viewedAt, cursor.viewedAt),
                    and(eq(viewerVideoViews.viewedAt, cursor.viewedAt), lt(videosTable.id, cursor.id))) : undefined
            )).orderBy(desc(viewerVideoViews.viewedAt), desc(videosTable.id)).limit(limit + 1);

        const hasMore = data.length > limit;
        const items = hasMore ? data.slice(0, - 1) : data

        const lastItem = items[items.length - 1]
        const nextCursor = hasMore ? {
            id: lastItem.id,
            viewedAt: lastItem.viewedAt
        } : null;
        return { items, nextCursor };
    }),

    getLiked: protectedProcedure.input(
        z.object({
            cursor: z.object({
                id: z.string().uuid(),
                likedAt: z.date(),
            })
                .nullish(),
            limit: z.number().min(1).max(100),
        })
    ).query(async ({ input, ctx }) => {
        const { limit, cursor } = input
        const { id: userId } = ctx.user;
        const viewerVideoReactions = db.$with('viewer_video_reactions').as(
            db.select(
                {
                    videoId: videoReactions.videoId,
                    likedAt: videoReactions.updatedAt
                }
            ).from(videoReactions).where(
                and(

                    eq(videoReactions.userId, userId),
                    eq(videoReactions.type, 'like')
                )
            )
        );
        const data = await db.with(viewerVideoReactions).
            select(
                {
                    ...getTableColumns(videosTable),
                    user: usersTable,
                    likedAt: viewerVideoReactions.likedAt,
                    // viewCount : db.$count(videoViews.videoId,videosTable.id),
                    likeCount: db.$count(videoReactions,
                        and(
                            eq(videoReactions.videoId, videosTable.id),
                            eq(videoReactions.type, 'like')
                        )
                    ),
                    dislikeCount: db.$count(videoReactions,
                        and(
                            eq(videoReactions.videoId, videosTable.id),
                            eq(videoReactions.type, 'dislike')
                        )
                    )
                }

            ).from(videosTable)
            .innerJoin(usersTable, eq(videosTable.userId, usersTable.id))
            .innerJoin(viewerVideoReactions, eq(videosTable.id, viewerVideoReactions.videoId))
            .where(and(
                eq(videosTable.visibility, 'public'),
                cursor ? or(lt(viewerVideoReactions.likedAt, cursor.likedAt),
                    and(eq(viewerVideoReactions.likedAt, cursor.likedAt), lt(videosTable.id, cursor.id))) : undefined
            )).orderBy(desc(viewerVideoReactions.likedAt), desc(videosTable.id)).limit(limit + 1);

        const hasMore = data.length > limit;
        const items = hasMore ? data.slice(0, - 1) : data

        const lastItem = items[items.length - 1]
        const nextCursor = hasMore ? {
            id: lastItem.id,
            likedAt: lastItem.likedAt
        } : null;
        return { items, nextCursor };
    }),


})