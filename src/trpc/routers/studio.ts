import { db } from "@/db";
import { z } from "zod";
import { videosTable } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, lt, min, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { paginate } from "@/hooks/use-paginate";

export const studioRouter = createTRPCRouter({
  // Query to get single video that belongs to the user
  getOne: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;
      const [video] = await db
        .select()
        .from(videosTable)
        .where(
          and(eq(videosTable.id, videoId), eq(videosTable.userId, userId))
        );
      if (!video)
        throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
      return video;
    }),

  // Query to get all videos that belongs to the user
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            videoId: z.string().uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )

    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const { id: userId } = ctx.user;

      const data = await db
        .select()
        .from(videosTable)
        .where(
          and(
            eq(videosTable.userId, userId),
            cursor
              ? or(
                  // Checking if videosTable most recent video
                  lt(videosTable.updatedAt, cursor.updatedAt),
                  and(
                    eq(videosTable.updatedAt, cursor.updatedAt),
                    lt(videosTable.id, cursor.videoId)
                  )
                )
              : undefined
          )
        )
        .orderBy(desc(videosTable.updatedAt), desc(videosTable.id))
        .limit(limit + 1);

      return paginate(data, limit);
    }),
});
