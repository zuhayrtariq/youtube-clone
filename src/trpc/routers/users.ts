import { db } from "@/db";
import { z } from "zod";
import { subscriptionsTable, usersTable, videosTable } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { eq, getTableColumns, inArray, isNotNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { clerkUserId } = ctx;
      let userId;
      const [user] = await db
        .select()
        .from(usersTable)
        .where(inArray(usersTable.clerkId, clerkUserId ? [clerkUserId] : []));
      if (user) {
        userId = user.id;
      }

      const subscribers = db.$with("subscribers").as(
        db
          .select({
            creatorId: subscriptionsTable.creatorId,
            viewerId: subscriptionsTable.viewerId,
          })
          .from(subscriptionsTable)
          .where(inArray(subscriptionsTable.viewerId, userId ? [userId] : []))
      );
      const [existingUser] = await db
        .with(subscribers)
        .select({
          ...getTableColumns(usersTable),
          viewerSubscribed: isNotNull(subscribers.viewerId).mapWith(Boolean),
          videoCount: db.$count(
            videosTable,
            eq(videosTable.userId, usersTable.id)
          ),
          subscriberCount: db.$count(
            subscriptionsTable,
            eq(subscriptionsTable.creatorId, usersTable.id)
          ),
        })
        .from(usersTable)
        .leftJoin(subscribers, eq(subscribers.creatorId, usersTable.id))
        .where(eq(usersTable.id, input.id));

      if (!existingUser) throw new TRPCError({ code: "NOT_FOUND" });
      return existingUser;
    }),
});
