import { db } from "@/db"
import { videosTable } from "@/db/schema"
import { model } from "@/lib/gemini"
import { trpc } from "@/trpc/server"
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm"
const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:

- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

//https://rattler-ready-midge.ngrok-free.app/api/videos/workflows/title

interface InputType {
    videoId: string;
    userId: string
}
export const { POST } = serve(
    async (context) => {
        const input = context.requestPayload as InputType;
        const { userId, videoId } = input
        const video = await context.run("get-video", async () => {
            const [existingVideo] = await db.select().from(videosTable).
                where(
                    and(
                        eq(videosTable.id, videoId),
                        eq(videosTable.userId, userId)
                    )
                )
            if (!existingVideo)
                throw new Error("No record found")
            return existingVideo
        })

        const videoTranscript = await context.run("get-video-transcript", async () => {
            const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`
            const response = await fetch(trackUrl);
            const text = await response.text()
            if (!text)
                throw new Error('Bad Request')
            return text
        })

        await context.run("update-video", async () => {

            const prompt = `${TITLE_SYSTEM_PROMPT}\n\nVideo Transcript:\n${videoTranscript}`;


            const result = await model.generateContent(prompt);
            console.log(result.response.text());
            const title = result.response.text() || videosTable.title
            await db.update(videosTable).set({
                title
            }).where(
                and(
                    eq(videosTable.id, videoId),
                    eq(videosTable.userId, userId)
                )
            )
        })


    }
)