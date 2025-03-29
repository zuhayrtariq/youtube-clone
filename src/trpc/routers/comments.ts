import { db } from "@/db";
import { commentReactions, commentsTable, usersTable } from "@/db/schema";
import { paginate } from "@/hooks/use-paginate";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  isNull,
  lt,
  or,
} from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        parentId: z.string().uuid().nullish(),
        value: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId, value, parentId } = input;
      const { id: userId } = ctx.user;

      const [existingComment] = await db
        .select()
        .from(commentsTable)
        .where(inArray(commentsTable.id, parentId ? [parentId] : []));

      // Comment does not exist and the user is replying to a comment
      if (!existingComment && parentId) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      // Comment is itself a reply and the user is replying to it
      if (existingComment && parentId && existingComment?.parentId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [newComment] = await db
        .insert(commentsTable)
        .values({
          userId,
          videoId,
          parentId,
          value,
        })
        .returning();
      return newComment;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        parentId: z.string().uuid().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const { id: userId } = ctx.user;

      const [deletedComment] = await db
        .delete(commentsTable)
        .where(and(eq(commentsTable.id, id), eq(commentsTable.userId, userId)))
        .returning();
      if (!deletedComment) throw new TRPCError({ code: "NOT_FOUND" });
      return deletedComment;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
        parentId: z.string().uuid().nullish(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { videoId, cursor, limit, parentId } = input;
      const { clerkUserId } = ctx;

      let userId;
      const [user] = await db
        .select()
        .from(usersTable)
        .where(inArray(usersTable.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) userId = user.id;

      const userReaction = db.$with("user_reaction").as(
        db
          .select({
            commentId: commentReactions.commentId,
            type: commentReactions.type,
          })
          .from(commentReactions)
          .where(inArray(commentReactions.userId, userId ? [userId] : []))
      );

      const replies = db.$with("replies").as(
        db
          .select({
            parentId: commentsTable.parentId,
            count: count(commentsTable.id).as("count"),
          })
          .from(commentsTable)
          .where(isNotNull(commentsTable.parentId))
          .groupBy(commentsTable.parentId)
      );

      const [comments, totalComments] = await Promise.all([
        db
          .with(userReaction, replies)
          .select({
            ...getTableColumns(commentsTable),
            user: usersTable,
            userReaction: userReaction.type,
            likeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.type, "like"),
                eq(commentsTable.id, commentReactions.commentId)
              )
            ),
            dislikeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.type, "dislike"),
                eq(commentsTable.id, commentReactions.commentId)
              )
            ),
            replyCount: replies.count,
          })
          .from(commentsTable)
          .where(
            and(
              eq(commentsTable.videoId, videoId),
              parentId
                ? eq(commentsTable.parentId, parentId)
                : isNull(commentsTable.parentId),
              cursor
                ? or(
                    lt(commentsTable.updatedAt, cursor.updatedAt),
                    and(
                      eq(commentsTable.updatedAt, cursor.updatedAt),
                      lt(commentsTable.id, cursor.id)
                    )
                  )
                : undefined
            )
          )
          .innerJoin(usersTable, eq(usersTable.id, commentsTable.userId))
          .leftJoin(userReaction, eq(userReaction.commentId, commentsTable.id))
          .leftJoin(replies, eq(commentsTable.id, replies.parentId))
          .orderBy(desc(commentsTable.updatedAt), desc(commentsTable.id))
          .limit(limit + 1),
        db
          .select({
            count: count(),
          })
          .from(commentsTable)
          .where(
            and(
              eq(commentsTable.videoId, videoId),

              isNull(commentsTable.parentId)
            )
          ),
      ]);

      const { items, nextCursor } = paginate(comments, limit);
      return { items, nextCursor, totalCount: totalComments[0].count };
    }),
});
