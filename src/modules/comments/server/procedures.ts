import { db } from "@/db";
import { commentReactions, commentsTable, subscriptionsTable, usersTable } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, inArray, lt, or } from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
    create: protectedProcedure.input(z.object({
        videoId: z.string().uuid(),
        value: z.string().min(1).max(1000)
    })).mutation(async ({ ctx, input }) => {
        const { videoId, value } = input;
        const { id: userId } = ctx.user

        const [newComment] = await db.insert(commentsTable).values({
            userId,
            videoId,
            value

        }).returning()
        return newComment
    }),
    remove: protectedProcedure.input(z.object({
        id: z.string().uuid()
    })).mutation(async ({ ctx, input }) => {
        const { id } = input;
        const { id: userId } = ctx.user

        const [deletedComment] = await db.delete(commentsTable).where(
            and(
                eq(commentsTable.id, id),
                eq(commentsTable.userId, userId),
            )
        ).returning()
        if (!deletedComment)
            throw new TRPCError({ code: 'NOT_FOUND' })
        return deletedComment
    }),
    getMany: baseProcedure.input(z.object({
        videoId: z.string().uuid(),
        cursor: z.object(
            {
                id: z.string().uuid(),
                updatedAt: z.date()
            }
        ).nullish(),
        limit: z.number().min(1).max(100)
    })).query(async ({ ctx, input }) => {
        const { videoId, cursor, limit } = input;
        const { clerkUserId } = ctx;

        let userId;
        const [user] = await db.select().from(usersTable).where(
            inArray(usersTable.clerkId, clerkUserId ? [clerkUserId] : [])
        )
        if (user)
            userId = user.id;

        const userReaction = db.$with('user_reaction').as(
            db.select({
                commentId: commentReactions.commentId,
                type: commentReactions.type,
            }).from(commentReactions).where(
                inArray(commentReactions.userId, userId ? [userId] : [])
            )
        )


        const [comments, totalComments] = await Promise.all(
            [
                db.with(userReaction).select(
                    {
                        ...getTableColumns(commentsTable),
                        user: usersTable,
                        userReaction: userReaction.type,
                        likeCount: db.$count(commentReactions,
                            and(eq(commentReactions.type, 'like'), eq(commentsTable.id, commentReactions.commentId))
                        ), dislikeCount: db.$count(commentReactions,
                            and(eq(commentReactions.type, 'dislike'), eq(commentsTable.id, commentReactions.commentId))
                        )
                    }
                ).from(commentsTable).where(
                    and(
                        eq(commentsTable.videoId, videoId),
                        cursor ? or(
                            lt(commentsTable.updatedAt, cursor.updatedAt),
                            and(
                                eq(commentsTable.updatedAt, cursor.updatedAt),
                                lt(commentsTable.id, cursor.id)

                            )
                        ) : undefined),

                ).innerJoin(usersTable, eq(usersTable.id, commentsTable.userId))
                    .leftJoin(userReaction, eq(userReaction.commentId, commentsTable.id,))
                    .orderBy(desc(commentsTable.updatedAt), desc(commentsTable.id))
                    .limit(limit + 1),
                db.select(
                    {
                        count: count()
                    }
                ).from(commentsTable).where(
                    eq(commentsTable.videoId, videoId)
                )

            ]
        )


        const hasMore = comments.length > limit;
        const items = hasMore ? comments.slice(0, -1) : comments;
        const lastItem = items[items.length - 1];
        const nextCursor = hasMore ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
        } : null
        return { items, nextCursor, totalCount: totalComments[0].count }
    })
})