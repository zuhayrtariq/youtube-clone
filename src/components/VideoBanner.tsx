import React from "react";
import { AlertTriangleIcon } from "lucide-react";
import { VideoGetOneOutput } from "@/types/videos";

interface VideoBannerProps {
  status: VideoGetOneOutput["muxStatus"];
}

const VideoBanner = ({ status }: VideoBannerProps) => {
  if (status == "ready") return null;

  return (
    <div className="bg-yellow-300 py-3 px-4  rounded-b-xl flex items-center gap-2">
      <AlertTriangleIcon className="size-4 text-black shrink-0" />
      <p className="text-black line-clamp-1 text-xs md:text-sm font-medium">
        This video is being processed
      </p>
    </div>
  );
};

export default VideoBanner;
