import { db } from "@/db";
import { usersTable, videosTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    thumbnailUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .input(z.object({
            videoId: z.string().uuid()
        }))
        .middleware(async ({ input }) => {
            console.log("CALLED")
            const { userId: clerkUserId } = await auth();

            if (!clerkUserId) throw new UploadThingError("Unauthorized");
            const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkUserId))
            if (!user) {
                throw new UploadThingError("Unauthorized");
            }
            const [existingVideo] = await db.select({
                thumbnailKey: videosTable.thumbnailKey
            }).from(videosTable).where(and(
                eq(videosTable.userId, user.id),
                eq(videosTable.id, input.videoId)
            ))
            if (!existingVideo) {
                throw new UploadThingError("Not Found")
            }
            if (existingVideo.thumbnailKey) {
                const utapi = new UTApi();
                await utapi.deleteFiles(existingVideo.thumbnailKey)
                await db.update(videosTable).set({
                    thumbnailKey: null,
                    thumbnailUrl: null
                }).where(and(
                    eq(videosTable.userId, user.id),
                    eq(videosTable.id, input.videoId)
                ))
            }
            return { user, ...input };
        })
        .onUploadComplete(async ({ metadata, file }) => {


            console.log("file url", file.ufsUrl);
            await db.update(videosTable).set({
                thumbnailUrl: file.ufsUrl,
                thumbnailKey: file.key
            })
                .where(and(eq(videosTable.userId, metadata.user.id), eq(videosTable.id, metadata.videoId)))

            return { uploadedBy: metadata.user.id };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
