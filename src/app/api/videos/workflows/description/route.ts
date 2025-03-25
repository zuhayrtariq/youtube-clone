import { db } from "@/db"
import { videosTable } from "@/db/schema"
import { model } from "@/lib/gemini"
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm"
const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

//https://rattler-ready-midge.ngrok-free.app/api/videos/workflows/description

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

            const prompt = `${DESCRIPTION_SYSTEM_PROMPT}\n\nVideo Transcript:\n${videoTranscript}`;


            const result = await model.generateContent(prompt);
            console.log(result.response.text());
            const description = result.response.text() || videosTable.description
            await db.update(videosTable).set({
                description
            }).where(
                and(
                    eq(videosTable.id, videoId),
                    eq(videosTable.userId, userId)
                )
            )
        })


    }
)