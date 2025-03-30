import React from "react";
import Link from "next/link";
import { VideoGetManyOutput } from "@/types/videos";
import VideoThumbnail from "./VideoThumbnail";
import VideoInfo from "./VideoInfo";
interface VideoRowCardProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

const VideoGridCard = ({ data, onRemove }: VideoRowCardProps) => {
  const { title, duration, id: videoId, previewUrl, thumbnailUrl } = data;
  return (
    <div className="flex flex-col gap-2 w-full group ">
      <Link prefetch href={`/videos/${videoId}`}>
        <VideoThumbnail
          duration={duration}
          title={title}
          previewUrl={previewUrl}
          thumbnailUrl={thumbnailUrl}
        />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
};

export default VideoGridCard;
