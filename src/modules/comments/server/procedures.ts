import { db } from "@/db";
import { commentsTable, subscriptionsTable, usersTable } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
    create: protectedProcedure.input(z.object({
        videoId: z.string().uuid(),
        value: z.string().min(1).max(100)
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
    getMany: baseProcedure.input(z.object({
        videoId: z.string().uuid(),
    })).query(async ({ ctx, input }) => {
        const { videoId } = input;

        const comments = await db.select(
            {
                ...getTableColumns(commentsTable),
                user: usersTable
            }
        ).from(commentsTable).where(
            eq(commentsTable.videoId, videoId)
        ).innerJoin(usersTable, eq(usersTable.id, commentsTable.userId))
        return comments
    })
})