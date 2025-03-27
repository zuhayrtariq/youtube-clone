import { DEFAULT_COMMENTS_LIMIT, DEFAULT_LIMIT } from "@/constants";
import VideoView from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

interface VideoPageProps {
  params: Promise<{
    videoId: string;
  }>;
}
const VideoPage = async ({ params }: VideoPageProps) => {
  const { videoId } = await params;
  void trpc.videos.getOne.prefetch({
    id: videoId,
  });
  void trpc.comments.getMany.prefetchInfinite({
    videoId: videoId,
    limit: DEFAULT_COMMENTS_LIMIT,
  });

  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoPage;
