import { db } from "@/db";
import { videosTable } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";

interface InputType {
  videoId: string;
}
export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { videoId } = input;
  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videosTable)
      .where(eq(videosTable.id, videoId));
    if (!existingVideo) throw new Error("No record found");
    return existingVideo;
  });

  await context.run("add-video-view", async () => {
    const views = video.views + 1;
    await db
      .update(videosTable)
      .set({
        views,
      })
      .where(eq(videosTable.id, videoId));
  });
});
