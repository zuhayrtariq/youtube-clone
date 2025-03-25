import { db } from "@/db"
import { videosTable } from "@/db/schema"
import { imgModel } from "@/lib/gemini"
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm"
import { UTApi } from "uploadthing/server"

//https://rattler-ready-midge.ngrok-free.app/api/videos/workflows/thumbnail

interface InputType {
    videoId: string;
    userId: string
    prompt: string
}
const utapi = new UTApi();

const generateThumbnail = async ({
    prompt
}: { prompt: string }) => {
    try {
        prompt = prompt + "The image size should be 1792x1024 pixels."
        const result = await imgModel.generateContent(prompt);
        const response = await result.response;
        if (
            response &&
            response.candidates &&
            response.candidates.length > 0 &&
            response.candidates[0].content &&
            response.candidates[0].content.parts
        ) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.mimeType && part.inlineData.data) {
                    return {
                        mimeType: part.inlineData.mimeType,
                        base64Data: part.inlineData.data,
                    };
                }
            }
        }
        throw new Error("Bad Request in AI Image"); // No image URL found.

    } catch (error) {
        console.error("Error generating content:", error);
    }
}

export const { POST } = serve(


    async (context) => {
        const input = context.requestPayload as InputType;
        const { userId, videoId, prompt } = input
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

        const data = await context.run("generate-new-thumbnail", async () => {
            const imageData = await generateThumbnail({ prompt });

            if (imageData) {
                try {
                    // Convert Base64 to File
                    const byteString = atob(imageData.base64Data);
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    const imageFile = new File([ab], videoId + 'thumbnail', {
                        type: imageData.mimeType,
                    });

                    // Upload to UploadThing
                    const uploadedFiles = await utapi.uploadFiles([imageFile]);

                    if (uploadedFiles && uploadedFiles.length > 0) {
                        // Access the URL via data.url, handle errors
                        if (uploadedFiles[0].data) {
                            const thumbnailUrl = uploadedFiles[0].data.ufsUrl;
                            const thumbnailKey = uploadedFiles[0].data.key;

                            return { thumbnailUrl, thumbnailKey }
                            // Do something with thumbnailUrl. For example store it in db.
                        } else if (uploadedFiles[0].error) {
                            console.error("UploadThing upload failed:", uploadedFiles[0].error);
                            throw new Error("Bad Request in AI Image")
                        }
                    } else {
                        console.error("UploadThing failed to upload the image.");
                        throw new Error("Bad Request in AI Image")
                    }
                } catch (error) {
                    console.error("Error during UploadThing or file conversion:", error);
                    throw new Error("Bad Request in AI Image")
                }
            }
        })


        await context.run('cleanup-thumbnail', async () => {
            if (!data) {
                return;
            }
            if (video.thumbnailKey) {
                await utapi.deleteFiles(video.thumbnailKey)
                await db.update(videosTable).set({
                    thumbnailUrl: null, thumbnailKey: null
                }).where(
                    and(
                        eq(videosTable.id, videoId),
                        eq(videosTable.userId, userId)
                    )
                )
            }
        })

        await context.run('update-thumbnail-url', async () => {
            if (!data) {
                return;
            }
            const { thumbnailUrl, thumbnailKey } = data
            await db.update(videosTable).set({
                thumbnailUrl,
                thumbnailKey
            }).where(
                and(
                    eq(videosTable.id, videoId),
                    eq(videosTable.userId, userId)
                )
            )
        })


    }
)