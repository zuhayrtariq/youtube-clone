import { db } from "@/db";
import { z } from 'zod'
import { videosTable } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, lt, min, or } from "drizzle-orm";
import { mux } from "@/lib/mux";

export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policy: ['public'],
                input: [
                    {
                        generated_subtitles: [
                            {
                                language_code: 'en',
                                name: 'English'
                            }
                        ]
                    }
                ]

            },
            cors_origin: "*"//Update this in production
        })

        const [video] = await db.insert(videosTable).values({
            userId,
            title: "Untitled",
            description: "Testing Desc",
            muxStatus: 'waiting',
            muxUploadId: upload.id,
        }).returning();
        return {
            url: upload.url,
            video: video
        }
    })
})