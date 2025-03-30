import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
export const videoReactionsRouter = createTRPCRouter({
  recordReaction: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        reactionType: z.enum(["like", "dislike"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { videoId, reactionType } = input;
      const { id: userId } = ctx.user;
      const [existingReaction] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.type, reactionType)
          )
        );
      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.userId, userId)
            )
          )
          .returning();
        return deletedReaction;
      }
      const [newReaction] = await db
        .insert(videoReactions)
        .values({
          videoId,
          userId,
          type: reactionType,
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: reactionType,
          },
        })
        .returning();
      return newReaction;
    }),
});
