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
  // Need to update this afterwards to infinite
  void trpc.comments.getMany.prefetch({ videoId: videoId });
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoPage;
