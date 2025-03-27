import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionsRouter = createTRPCRouter(
    {
        likeReaction: protectedProcedure.input(z.object({
            commentId: z.string()
        })).mutation(async ({ input, ctx }) => {
            const { commentId } = input;
            const { id: userId } = ctx.user;
            const [existingReaction] = await db.select().from(commentReactions).where(
                and(
                    eq(commentReactions.commentId, commentId),
                    eq(commentReactions.userId, userId),
                    eq(commentReactions.type, 'like')
                )
            )
            if (existingReaction) {
                const [deletedReaction] = await db.delete(commentReactions).where(
                    and(

                        eq(commentReactions.commentId, commentId),
                        eq(commentReactions.userId, userId)
                    )
                ).returning()
                return deletedReaction;
            }
            const [newReaction] = await db.insert(commentReactions).values({
                commentId,
                userId,
                type: 'like'
            }).onConflictDoUpdate(
                {
                    target: [commentReactions.commentId, commentReactions.userId],
                    set: {
                        type: 'like'
                    }

                }
            ).returning()
            return newReaction

        }),
        dislikeReaction: protectedProcedure.input(z.object({
            commentId: z.string()
        })).mutation(async ({ input, ctx }) => {
            const { commentId } = input;
            const { id: userId } = ctx.user;
            const [existingReaction] = await db.select().from(commentReactions).where(
                and(
                    eq(commentReactions.commentId, commentId),
                    eq(commentReactions.userId, userId),
                    eq(commentReactions.type, 'dislike')
                )
            )
            if (existingReaction) {
                const [deletedReaction] = await db.delete(commentReactions).where(
                    and(

                        eq(commentReactions.commentId, commentId),
                        eq(commentReactions.userId, userId)
                    )
                ).returning()
                return deletedReaction;
            }
            const [newReaction] = await db.insert(commentReactions).values({
                commentId,
                userId,
                type: 'dislike'
            }).onConflictDoUpdate(
                {
                    target: [commentReactions.commentId, commentReactions.userId],
                    set: {
                        type: 'dislike'
                    }

                }
            ).returning()
            return newReaction

        }),
    }
)