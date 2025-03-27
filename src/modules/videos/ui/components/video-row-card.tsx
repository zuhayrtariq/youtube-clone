import { cva, VariantProps } from "class-variance-authority";
import React, { useMemo } from "react";
import { VideoGetManyOutput } from "../../types";
import Link from "next/link";
import VideoThumbnail from "./video-thumbnail";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import UserInfo from "@/modules/users/ui/components/user-info";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import VideoMenu from "./video-menu";

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

const videoRowCardVariants = cva("group flex min-w-0", {
  variants: {
    size: {
      default: "gap-4",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const thumbnailVariants = cva("relative flex-none", {
  variants: {
    size: {
      default: "w-[38%]",
      compact: "w-[168px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const VideoRowCardSkeleton = ({}: VideoRowCardProps) => {
  return <div>Skeleton</div>;
};
const VideoRowCard = ({ data, size, onRemove }: VideoRowCardProps) => {
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

  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(views);
  }, []);
  const compactLikes = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(likeCount);
  }, []);
  return (
    <div className={videoRowCardVariants({ size })}>
      <Link href={`/videos/${videoId}`} className={thumbnailVariants({ size })}>
        <VideoThumbnail
          duration={duration}
          previewUrl={previewUrl}
          thumbnailUrl={thumbnailUrl}
          title={data.title}
        />
      </Link>

      {/* Info */}

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-x-2">
          <Link href={`/videos/${videoId}`} className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium line-clamp-2",
                size == "compact" ? "text-xs" : "text-sm"
              )}
            >
              {title}
            </h3>
            {size == "default" && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} views • {compactLikes} likes
              </p>
            )}
            {size == "default" && (
              <>
                <div className="flex items-center gap-2 my-3">
                  <UserAvatar
                    size={"sm"}
                    imageUrl={user.imageUrl}
                    name={user.name}
                  />
                  <UserInfo size={"sm"} name={user.name} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="w-fit text-xs text-muted-foreground line-clamp-2">
                      {description || "No description"}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="bg-black/70"
                  >
                    <p>From the video description</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {size == "compact" && <UserInfo size={"sm"} name={user.name} />}
            {size == "compact" && (
              <p className="text-xs text-muted-foreground mt-1">
                {compactViews} views • {compactLikes} likes
              </p>
            )}
          </Link>
          <div className="flex-none">
            <VideoMenu onRemove={onRemove} videoId={videoId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRowCard;
