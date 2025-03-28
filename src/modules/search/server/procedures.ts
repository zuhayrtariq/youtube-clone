import { db } from "@/db";
import { z } from 'zod'
import { usersTable, videoReactions, videosTable } from "@/db/schema";
import { baseProcedure, createTRPCRouter, } from "@/trpc/init";
import { and, desc, eq, getTableColumns, ilike, lt, min, or } from "drizzle-orm";

export const searchRouter = createTRPCRouter({

    getMany: baseProcedure.input(
        z.object({
            query: z.string().nullish(),
            categoryId: z.string().uuid().nullish(),
            cursor: z.object({
                id: z.string().uuid(),
                updatedAt: z.date(),
            })
                .nullish(),
            limit: z.number().min(1).max(100),
        })
    )

        .query(async ({ input }) => {
            const { limit, cursor, query, categoryId } = input
            const data = await db.select(

                {
                    ...getTableColumns(videosTable),
                    user: usersTable,
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
                .where(and(
                    query ? ilike(videosTable.title, `%${query}%`) : undefined,
                    categoryId ? eq(videosTable.categoryId, categoryId) : undefined,
                    cursor ? or(lt(videosTable.updatedAt, cursor.updatedAt),
                        and(eq(videosTable.updatedAt, cursor.updatedAt), lt(videosTable.id, cursor.id))) : undefined
                )).orderBy(desc(videosTable.updatedAt), desc(videosTable.id)).limit(limit + 1);

            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, - 1) : data

            const lastItem = items[items.length - 1]
            const nextCursor = hasMore ? {
                id: lastItem.id,
                updatedAt: lastItem.updatedAt
            } : null;
            return { items, nextCursor };
        })
})