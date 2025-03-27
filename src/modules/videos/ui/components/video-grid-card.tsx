import { VariantProps } from "class-variance-authority";
import React from "react";
import { VideoGetManyOutput } from "../../types";
import Link from "next/link";
import VideoThumbnail from "./video-thumbnail";
import VideoInfo from "./video-info";
interface VideoRowCardProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

const VideoGridCard = ({ data, onRemove }: VideoRowCardProps) => {
  const {
    title,
    duration,
    id: videoId,
    likeCount,
    previewUrl,
    thumbnailUrl,
    user,
    views,
    description,
  } = data;
  return (
    <div className="flex flex-col gap-2 w-full group">
      <Link href={`/videos/${videoId}`}>
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
