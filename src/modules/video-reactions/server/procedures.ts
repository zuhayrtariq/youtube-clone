import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
export const videoReactionsRouter = createTRPCRouter(
    {
        likeReaction: protectedProcedure.input(z.object({
            videoId: z.string().uuid()
        })).mutation(async ({ input, ctx }) => {
            const { videoId } = input;
            const { id: userId } = ctx.user;
            const [existingReaction] = await db.select().from(videoReactions).where(
                and(
                    eq(videoReactions.videoId, videoId),
                    eq(videoReactions.userId, userId),
                    eq(videoReactions.type, 'like')
                )
            )
            if (existingReaction) {
                const [deletedReaction] = await db.delete(videoReactions).where(
                    and(
                        eq(videoReactions.videoId, videoId),
                        eq(videoReactions.userId, userId),
                    )
                ).returning();
                return deletedReaction

            }
            const [newReaction] = await db.insert(videoReactions).values({
                videoId,
                userId,
                type: 'like'
            }).onConflictDoUpdate(
                {
                    target: [videoReactions.userId, videoReactions.videoId], set: {
                        type: 'like'
                    }
                }
            ).returning()
            return newReaction
        }),
        dislikeReaction: protectedProcedure.input(z.object({
            videoId: z.string().uuid()
        })).mutation(async ({ input, ctx }) => {
            const { videoId } = input;
            const { id: userId } = ctx.user;
            const [existingReaction] = await db.select().from(videoReactions).where(
                and(
                    eq(videoReactions.videoId, videoId),
                    eq(videoReactions.userId, userId),
                    eq(videoReactions.type, 'dislike')
                )
            )
            if (existingReaction) {
                const [deletedReaction] = await db.delete(videoReactions).where(
                    and(
                        eq(videoReactions.videoId, videoId),
                        eq(videoReactions.userId, userId),
                    )
                ).returning();
                return deletedReaction

            }
            const [newReaction] = await db.insert(videoReactions).values({
                videoId,
                userId,
                type: 'dislike'
            }).onConflictDoUpdate(
                {
                    target: [videoReactions.userId, videoReactions.videoId], set: {
                        type: 'dislike'
                    }
                }
            ).returning()
            return newReaction
        })
    }
)