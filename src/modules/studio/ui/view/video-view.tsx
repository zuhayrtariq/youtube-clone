import React from "react";
import VideoForm from "./form-section";

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="px-4 pt-2.5  max-w-[1200px]">
      <VideoForm videoId={videoId} />
    </div>
  );
};

export default VideoView;
