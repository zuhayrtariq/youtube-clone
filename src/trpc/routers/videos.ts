import { db } from "@/db";
import { z } from 'zod'
import { subscriptionsTable, usersTable, videoReactions, videosTable, videoUpdateSchema, videoViews } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, getTableColumns, ilike, inArray, isNotNull, lt, min, or } from "drizzle-orm";
import { mux } from "@/lib/mux";
import { TRPCError } from "@trpc/server";
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/workflow";

export const videosRouter = createTRPCRouter({



    getMany: baseProcedure.input(
        z.object({
            categoryId: z.string().uuid().nullish(),
            cursor: z.object({
                id: z.string().uuid(),
                updatedAt: z.date(),
            })
                .nullish(),
            limit: z.number().min(1).max(100),
        })
    )

        .query(async ({ input }) => {
            const { limit, cursor, categoryId } = input
            const data = await db.select(

                {
                    ...getTableColumns(videosTable),
                    user: usersTable,
                    // viewCount : db.$count(videoViews.videoId,videosTable.id),
                    likeCount: db.$count(videoReactions,
                        and(
                            eq(videoReactions.videoId, videosTable.id),
                            eq(videoReactions.type, 'like')
                        )
                    ),
                    dislikeCount: db.$count(videoReactions,
                        and(
                            eq(videoReactions.videoId, videosTable.id),
                            eq(videoReactions.type, 'dislike')
                        )
                    )
                }

            ).from(videosTable)
                .innerJoin(usersTable, eq(videosTable.userId, usersTable.id))
                .where(and(
                    eq(videosTable.visibility, 'public'),
                    categoryId ? eq(videosTable.categoryId, categoryId) : undefined,
                    cursor ? or(lt(videosTable.updatedAt, cursor.updatedAt),
                        and(eq(videosTable.updatedAt, cursor.updatedAt), lt(videosTable.id, cursor.id))) : undefined
                )).orderBy(desc(videosTable.updatedAt), desc(videosTable.id)).limit(limit + 1);

            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, - 1) : data

            const lastItem = items[items.length - 1]
            const nextCursor = hasMore ? {
                id: lastItem.id,
                updatedAt: lastItem.updatedAt
            } : null;
            return { items, nextCursor };
        }),

    getManySubscriptions: protectedProcedure.input(
        z.object({
            cursor: z.object({
                id: z.string().uuid(),
                updatedAt: z.date(),
            })
                .nullish(),
            limit: z.number().min(1).max(100),
        })
    )

        .query(async ({ input, ctx }) => {
            const { limit, cursor } = input
            const { id: userId } = ctx.user

            const viewerSubscriptions = db.$with("viewer_subscriptions").as(
                db.select({
                    userId: subscriptionsTable.creatorId
                }).from(subscriptionsTable).where(
                    eq(subscriptionsTable.viewerId, userId)
                )
            )

            const data = await db.with(viewerSubscriptions)
                .select(
                    {
                        ...getTableColumns(videosTable),
                        user: usersTable,
                        likeCount: db.$count(videoReactions,
                            and(
                                eq(videoReactions.videoId, videosTable.id),
                                eq(videoReactions.type, 'like')
                            )
                        ),
                        dislikeCount: db.$count(videoReactions,
                            and(
                                eq(videoReactions.videoId, videosTable.id),
                                eq(videoReactions.type, 'dislike')
                            )
                        )
                    }

                ).from(videosTable)
                .innerJoin(usersTable, eq(videosTable.userId, usersTable.id))
                .innerJoin(viewerSubscriptions, eq(viewerSubscriptions.userId, usersTable.id))
                .where(and(
                    eq(videosTable.visibility, 'public'),
                    cursor ? or(lt(videosTable.updatedAt, cursor.updatedAt),
                        and(eq(videosTable.updatedAt, cursor.updatedAt), lt(videosTable.id, cursor.id))) : undefined
                )).orderBy(desc(videosTable.updatedAt), desc(videosTable.id)).limit(limit + 1);

            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, - 1) : data

            const lastItem = items[items.length - 1]
            const nextCursor = hasMore ? {
                id: lastItem.id,
                updatedAt: lastItem.updatedAt
            } : null;
            return { items, nextCursor };
        }),



    getManyTrending: baseProcedure.input(
        z.object({
            cursor: z.object({
                id: z.string().uuid(),
                views: z.number(),
            })
                .nullish(),
            limit: z.number().min(1).max(100),
        })
    )
        .query(async ({ input }) => {
            const { limit, cursor } = input

            // const viewCountSubQuery  = db.$count(

            // )

            const data = await db.select(

                {
                    ...getTableColumns(videosTable),
                    user: usersTable,
                    // viewCount : db.$count(videoViews.videoId,videosTable.id),
                    likeCount: db.$count(videoReactions,
                        and(
                            eq(videoReactions.videoId, videosTable.id),
                            eq(videoReactions.type, 'like')
                        )
                    ),
                    dislikeCount: db.$count(videoReactions,
                        and(
                            eq(videoReactions.videoId, videosTable.id),
                            eq(videoReactions.type, 'dislike')
                        )
                    )
                }

            ).from(videosTable)
                .innerJoin(usersTable, eq(videosTable.userId, usersTable.id))
                .where(and(
                    eq(videosTable.visibility, 'public'),
                    cursor ? or(lt(videosTable.views, cursor.views),
                        and(eq(videosTable.views, cursor.views), lt(videosTable.id, cursor.id))) : undefined
                )).orderBy(desc(videosTable.views), desc(videosTable.id)).limit(limit + 1);

            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, - 1) : data

            const lastItem = items[items.length - 1]
            const nextCursor = hasMore ? {
                id: lastItem.id,
                views: lastItem.views
            } : null;
            return { items, nextCursor };
        }),

    revalidate: protectedProcedure.input(z.object({
        id: z.string().uuid()
    })
    ).mutation(async ({ input, ctx }) => {
        const { id: videoId } = input;
        const { id: userId } = ctx.user;

        const [existingVideo] = await db.select().from(videosTable).where(
            and(
                eq(videosTable.userId, userId),
                eq(videosTable.id, videoId),
            )
        )
        if (!existingVideo)
            throw new TRPCError({ code: 'NOT_FOUND' })

        const { muxUploadId } = existingVideo
        if (!muxUploadId)
            throw new TRPCError({ code: 'BAD_REQUEST' })
        const directUpload = await mux.video.uploads.retrieve(muxUploadId);
        const { asset_id } = directUpload
        if (!asset_id)
            throw new TRPCError({ code: 'BAD_REQUEST' })

        const asset = await mux.video.assets.retrieve(asset_id)
        if (!asset)
            throw new TRPCError({ code: 'BAD_REQUEST' })

        const { duration, id: assetId, playback_ids, status } = asset
        const playbackId = playback_ids?.[0].id;

        const durationInt = duration ? Math.round(duration * 1000) : 0


        const updatedVideo = await db.update(videosTable).set({
            muxStatus: status,
            muxPlaybackId: playbackId,
            duration: durationInt,
            muxAssetId: assetId,
        }).where(
            and(
                eq(videosTable.userId, userId),
                eq(videosTable.id, videoId),

            )
        ).returning();
        return updatedVideo

    }),

    getOne: baseProcedure.input(z.object({
        id: z.string().uuid()
    })).query(async ({ input, ctx }) => {
        const { id: videoId } = input;
        const { clerkUserId } = ctx;
        let userId;
        const [user] = await db.select().from(usersTable).where(
            inArray(usersTable.clerkId, clerkUserId ? [clerkUserId] : [])
        )
        if (user) {
            userId = user.id;
        }

        const userReaction = db.$with('user_reaction').as(
            db.select({
                videoId: videoReactions.videoId,
                type: videoReactions.type
            }).from(videoReactions).where(
                inArray(videoReactions.userId, userId ? [userId] : [])
            )
        )

        const subscribers = db.$with('subscribers').as(
            db.select(
                {
                    creatorId: subscriptionsTable.creatorId,
                    viewerId: subscriptionsTable.viewerId
                }
            ).from(subscriptionsTable).where(
                inArray(subscriptionsTable.viewerId, userId ? [userId] : [])
            )
        )
        const [existingVideo] = await db.with(userReaction, subscribers).select(
            {
                ...getTableColumns(videosTable),
                user: {
                    ...getTableColumns(usersTable),
                    viewerSubscribed: isNotNull(subscribers.viewerId).mapWith(Boolean),
                    subscriberCount: db.$count(subscribers, eq(subscribers.creatorId, videosTable.userId)),

                },
                viewCount: db.$count(videoViews, eq(videoViews.videoId, videosTable.id)),
                likeCount: db.$count(videoReactions, and(
                    eq(videoReactions.videoId, videoId),
                    eq(videoReactions.type, 'like')
                )),
                disLikeCount: db.$count(videoReactions, and(
                    eq(videoReactions.videoId, videoId),
                    eq(videoReactions.type, 'dislike')
                )),
                userReaction: userReaction.type,


            }
        ).from(videosTable).innerJoin(
            usersTable, eq(videosTable.userId, usersTable.id)
        )
            .leftJoin(
                userReaction, eq(videosTable.id, userReaction.videoId)
            )
            .leftJoin(
                subscribers, eq(subscribers.creatorId, usersTable.id)
            )
            .where(
                eq(videosTable.id, videoId)
            )
        // .groupBy(
        //     videosTable.id,
        //     usersTable.id,
        //     userReaction.type
        // )
        if (!existingVideo)
            throw new TRPCError({ code: 'NOT_FOUND' })
        return existingVideo
    }),
    addView: baseProcedure.input(z.object({
        id: z.string().uuid()
    })).mutation(async ({ input, ctx }) => {
        const { id: videoId } = input;
        const { workflowRunId } = await workflow.trigger({
            url: process.env.UPSTASH_WORKFLOW_URL + "/api/videos/workflows/video-view",
            body: {
                videoId: input.id
            }
        })
        return workflowRunId
    })
    ,
    generateTitle: protectedProcedure.input(z.object({
        id: z.string().uuid()
    })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user
        const { workflowRunId } = await workflow.trigger({
            url: process.env.UPSTASH_WORKFLOW_URL + "/api/videos/workflows/title",
            body: {
                userId,
                videoId: input.id
            }
        })
        return workflowRunId
    }),
    generateDescription: protectedProcedure.input(z.object({
        id: z.string().uuid()
    })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user
        const { workflowRunId } = await workflow.trigger({
            url: process.env.UPSTASH_WORKFLOW_URL + "/api/videos/workflows/description",
            body: {
                userId,
                videoId: input.id
            }
        })
        return workflowRunId
    }),
    generateThumbnail: protectedProcedure.input(z.object({
        id: z.string().uuid(),
        prompt: z.string().min(10)
    })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user
        const { workflowRunId } = await workflow.trigger({
            url: process.env.UPSTASH_WORKFLOW_URL + "/api/videos/workflows/thumbnail",
            body: {
                userId,
                videoId: input.id,
                prompt: input.prompt
            }
        })
        return workflowRunId
    })
    ,
    restoreThumbnail: protectedProcedure.input(z.object({
        id: z.string().uuid()
    })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;
        const { id } = input;
        const [existingVideo] = await db.select().from(videosTable).where(
            and(
                eq(videosTable.id, id),
                eq(
                    videosTable.userId, userId
                )
            )
        )
        if (!existingVideo)
            throw new TRPCError({ code: 'NOT_FOUND' })

        if (existingVideo.thumbnailKey) {
            const utapi = new UTApi();
            await utapi.deleteFiles(existingVideo.thumbnailKey)
            await db.update(videosTable).set({
                thumbnailKey: null,
                thumbnailUrl: null
            }).where(and(
                eq(videosTable.userId, userId),
                eq(videosTable.id, id)
            ))
        }
        if (!existingVideo.muxPlaybackId)
            throw new TRPCError({ code: 'BAD_REQUEST' })
        const playbackId = existingVideo.muxPlaybackId
        const thumbnailUrl = "https://image.mux.com/" + playbackId + "/thumbnail.jpg";
        const [updatedVideo] = await db.update(videosTable).set({
            thumbnailUrl
        }).where(and(
            eq(videosTable.id, id),
            eq(
                videosTable.userId, userId
            )
        )).returning();
        return updatedVideo
    }),

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
    }),
    update: protectedProcedure.input(videoUpdateSchema).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;
        const { title, description, categoryId, visibility, id } = input
        if (!id) {
            throw new TRPCError({ code: 'BAD_REQUEST' })
        }
        const [updatedVideo] = await db.update(videosTable).set({
            title, description, categoryId, visibility,
            updatedAt: new Date()
        }).where(
            and(
                eq(videosTable.id, id),
                eq(videosTable.userId, userId),
            )
        ).returning();
        if (!updatedVideo) {
            throw new TRPCError({ code: 'NOT_FOUND' })
        } return updatedVideo
    }),
    remove: protectedProcedure.input(z.object({
        id: z.string().uuid()
    })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;
        const { id } = input;
        const [removedVideo] = await db.delete(videosTable).where(and(eq(videosTable.id, id), eq(videosTable.userId, userId))).returning();
        if (!removedVideo) {
            throw new TRPCError({ code: 'NOT_FOUND' })
        } return removedVideo
    })
})