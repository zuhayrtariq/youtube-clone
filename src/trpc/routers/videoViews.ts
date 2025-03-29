import { db } from "@/db";
import { videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoViewsRouter = createTRPCRouter({
  // Add a view to the video
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { videoId } = input;

      const [videoView] = await db
        .select()
        .from(videoViews)
        .where(
          and(eq(videoViews.userId, userId), eq(videoViews.videoId, videoId))
        );
      if (videoView) {
        const [updatedView] = await db
          .update(videoViews)
          .set({
            updatedAt: new Date(),
          })
          .where(
            and(eq(videoViews.userId, userId), eq(videoViews.videoId, videoId))
          )
          .returning();
        return updatedView;
      }
      const [newVideoView] = await db
        .insert(videoViews)
        .values({
          userId,
          videoId,
        })
        .returning();
      return newVideoView;
    }),
});
