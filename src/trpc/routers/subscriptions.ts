import { db } from "@/db";
import { subscriptionsTable } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const subscriptionsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      const { id: subscriberId } = ctx.user;
      if (subscriberId === userId) throw new TRPCError({ code: "BAD_REQUEST" });
      const [newSubscriber] = await db
        .insert(subscriptionsTable)
        .values({
          creatorId: userId,
          viewerId: subscriberId,
        })
        .returning();
      return newSubscriber;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      const { id: subscriberId } = ctx.user;
      if (subscriberId === userId) throw new TRPCError({ code: "BAD_REQUEST" });
      const [removedSubscriber] = await db
        .delete(subscriptionsTable)
        .where(
          and(
            eq(subscriptionsTable.creatorId, userId),
            eq(subscriptionsTable.viewerId, subscriberId)
          )
        )
        .returning();
      return removedSubscriber;
    }),
});
