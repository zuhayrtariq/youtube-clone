import React from "react";
import VideoSection from "../sections/video-section";
import SuggestionsSection from "../sections/suggestions-section";
import CommentsSection from "../sections/comments-section";

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className="flex flex-col w-full max-w-[1700px] mx-auto px-4 pb-10 pt-2.5 ">
      <div className="flex flex-col xl:flex-row gap-6 ">
        <div className="min-w-0 flex-1">
          <VideoSection videoId={videoId} />
          <div className="xl:hidden mt-4 block">
            <SuggestionsSection />
          </div>
          <CommentsSection videoId={videoId} />
        </div>
        <div className="hidden  w-full xl:w-[380px] 2xl:w-[460px] shrink xl:flex">
          <SuggestionsSection />
        </div>
      </div>
    </div>
  );
};

export default VideoView;
