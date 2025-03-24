import { db } from "@/db";
import { videosTable } from "@/db/schema";
import { mux } from "@/lib/mux";
import { VideoAssetCreatedWebhookEvent, VideoAssetDeletedWebhookEvent, VideoAssetErroredWebhookEvent, VideoAssetReadyWebhookEvent, VideoAssetTrackReadyWebhookEvent } from "@mux/mux-node/resources/webhooks.mjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET;

type WebhookEvent = VideoAssetCreatedWebhookEvent | VideoAssetDeletedWebhookEvent | VideoAssetReadyWebhookEvent | VideoAssetTrackReadyWebhookEvent | VideoAssetErroredWebhookEvent

export const POST = async (request: Request) => {
    if (!SIGNING_SECRET)
        throw new Error("MUX_WEBHOOK_SECRET is not defined")
    const headersPayload = await headers();
    const muxSignature = headersPayload.get('mux-signature')
    if (!muxSignature)
        return new Response("Mux Signature not found", { status: 401 })

    const payload = await request.json();
    const body = JSON.stringify(payload)
    mux.webhooks.verifySignature(body, {
        "mux-signature": muxSignature
    },
        SIGNING_SECRET)
    switch (payload.type as WebhookEvent['type']) {
        case 'video.asset.created': {
            const data = payload.data as VideoAssetCreatedWebhookEvent['data']
            if (!data.upload_id) {
                return new Response('No upload_id found', { status: 400 })
            }
            await db.update(videosTable).set({
                muxAssetId: data.id,
                muxStatus: data.status,

            })
                .where(
                    eq(videosTable.muxUploadId, data.upload_id)
                )
            break;
        }
        case 'video.asset.ready': {
            const data = payload.data as VideoAssetReadyWebhookEvent['data']
            if (!data.upload_id) {
                return new Response('No upload_id found', { status: 400 })
            }
            const playbackId = data.playback_ids?.[0].id;
            if (!playbackId) {
                return new Response('Missing playback ID', { status: 400 })
            }
            const thumbnailUrl = "https://image.mux.com/" + playbackId + "/thumbnail.jpg";
            const previewUrl = "https://image.mux.com/" + playbackId + "/animated.gif";
            const duration = data.duration ? Math.round(data.duration * 1000) : 0
            await db.update(videosTable).set({
                thumbnailUrl,
                previewUrl,
                duration,
                muxPlaybackId: playbackId,
                muxStatus: data.status,
                muxAssetId: data.id
            }).where(eq(videosTable.muxUploadId, data.upload_id))
            break
        }
        case 'video.asset.errored': {
            const data = payload.data as VideoAssetErroredWebhookEvent['data']
            if (!data.upload_id) {
                return new Response('No upload_id found', { status: 400 })
            }
            await db.update(videosTable).set({

                muxStatus: data.status,
            }).where(eq(videosTable.muxUploadId, data.upload_id))
            break
        }
        case 'video.asset.deleted': {
            const data = payload.data as VideoAssetDeletedWebhookEvent['data']
            if (!data.upload_id) {
                return new Response('No upload_id found', { status: 400 })
            }
            await db.delete(videosTable).where(eq(videosTable.muxUploadId, data.upload_id))
            break
        }
        case 'video.asset.track.ready': {
            const data = payload.data as VideoAssetTrackReadyWebhookEvent['data'] & {
                asset_id: string
            }
            const assetId = data.asset_id;
            const trackId = data.id;
            const status = data.status;
            console.log("Track Ready Fired")
            if (!assetId) {
                return new Response('No asset_id found', { status: 400 })
            }
            await db.update(videosTable).
                set(
                    {
                        muxTrackId: trackId,
                        muxTrackStatus: status
                    }
                )
                .where(eq(videosTable.muxAssetId, assetId))
            break
        }
    }
    return new Response('Webhook Received', { status: 200 })
}