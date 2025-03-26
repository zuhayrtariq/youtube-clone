import React, { useMemo } from "react";
import { VideoGetOneOutput } from "../../types";
import VideoOwner from "./video-owner";
import VideoReactions from "./video-reaction";
import VideoMenu from "./video-menu";
import VideoDescription from "./video-description";
import { format, formatDistanceToNow } from "date-fns";

interface VideoTopRowProps {
  video: VideoGetOneOutput;
}
const VideoTopRow = ({ video }: VideoTopRowProps) => {
  const { views, createdAt, likeCount, disLikeCount, userReaction } = video;
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(views);
  }, []);
  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "standard",
    }).format(views);
  }, []);

  const compactDate = useMemo(() => {
    return formatDistanceToNow(createdAt, { addSuffix: true });
  }, [createdAt]);
  const expandedDate = useMemo(() => {
    return format(createdAt, "d MMM yyyy");
  }, [createdAt]);
  return (
    <div className="flex flex-col gap-4 mt-4 ">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwner videoId={video.id} user={video.user} />
        <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible -mb-2 pb-2 sm:pb-0 sm:mb-0 gap-2">
          <VideoReactions
            likeCount={likeCount}
            dislikeCount={disLikeCount}
            userReaction={userReaction}
            videoId={video.id}
          />
          <VideoMenu videoId={video.id} variant="secondary" />
        </div>
      </div>
      <VideoDescription
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandedDate={expandedDate}
        description={video.description}
      />
    </div>
  );
};

export default VideoTopRow;
