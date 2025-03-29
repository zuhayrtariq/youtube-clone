import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface VideoThumbnailProps {
  title: string;
  duration: number;
  thumbnailUrl?: string | undefined | null;
  previewUrl?: string | undefined | null;
}
const VideoThumbnail = ({
  thumbnailUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      <div className="w-full relative overflow-hidden rounded-xl aspect-video">
        <Image
          src={thumbnailUrl ?? "/placeholder.svg"}
          alt={title}
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl ?? "/placeholder.svg"}
          alt={title}
          fill
          className="size-full object-cover group-hover:opacity-100 opacity-0"
        />
      </div>
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
        {formatDuration(duration)}
      </div>
    </div>
  );
};

export default VideoThumbnail;
