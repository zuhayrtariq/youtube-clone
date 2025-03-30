import React from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { VideoGetOneOutput } from "@/types/videos";
import UserAvatar from "./UserAvatar";
import UserInfo from "./UserInfo";
import SubscribeButton from "./SubscribeButton";
interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}
const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId: clerkUserId, isLoaded } = useAuth();
  const { subscriberCount, viewerSubscribed } = user;

  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: viewerSubscribed,
    fromVideoId: videoId,
  });
  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3">
      <Link prefetch href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size={"lg"} imageUrl={user.imageUrl} name={user.name} />
          <div className="flex flex-col gap-0">
            <UserInfo name={user.name} size={"lg"} />
            <span className="line-clamp-1 text-muted-foreground text-sm">
              {subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>
      {clerkUserId == user.clerkId ? (
        <Button className="rounded-full " asChild variant={"secondary"}>
          <Link prefetch href={`/studio/videos/${videoId}`}>
            Edit Video
          </Link>
        </Button>
      ) : (
        <SubscribeButton
          onClick={onClick}
          disabled={isPending || !isLoaded}
          isSubscribed={viewerSubscribed}
        />
      )}
    </div>
  );
};

export default VideoOwner;
