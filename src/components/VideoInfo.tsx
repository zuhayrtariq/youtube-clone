import React, { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { VideoGetManyOutput } from "@/types/videos";
import UserAvatar from "./UserAvatar";
import UserInfo from "./UserInfo";
import VideoMenu from "./VideoMenu";

interface VideoInfoProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
  const { title, id: videoId, user, views, createdAt } = data;
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(views);
  }, []);
  const compactDate = useMemo(() => {
    return formatDistanceToNow(createdAt, { addSuffix: true });
  }, [createdAt]);
  return (
    <div className="flex gap-3">
      <Link href={`/users/${user.id}`}>
        <UserAvatar imageUrl={user.imageUrl} name={user.name} />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`videos/${videoId}`}>
          <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
            {title}
          </h3>
        </Link>
        <Link href={`/users/${user.id}`}>
          <UserInfo name={user.name} />
        </Link>
        <Link href={`videos/${videoId}`}>
          <p>
            {compactViews} views • {compactDate}
          </p>
        </Link>
      </div>
      <div className="flex shrink-0">
        <VideoMenu videoId={videoId} onRemove={onRemove} />
      </div>
    </div>
  );
};

export default VideoInfo;
