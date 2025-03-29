import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionsRouter = createTRPCRouter({
  recordReaction: protectedProcedure
    .input(
      z.object({
        commentId: z.string(),
        reactionType: z.enum(["like", "dislike"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { commentId, reactionType } = input;
      const { id: userId } = ctx.user;
      const [existingReaction] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.type, reactionType)
          )
        );
      if (existingReaction) {
        const [deletedReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.userId, userId)
            )
          )
          .returning();
        return deletedReaction;
      }
      const [newReaction] = await db
        .insert(commentReactions)
        .values({
          commentId,
          userId,
          type: reactionType,
        })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: {
            type: reactionType,
          },
        })
        .returning();
      return newReaction;
    }),
});
