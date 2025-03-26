import React from "react";
import { VideoGetOneOutput } from "../../types";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SubscribeButton from "@/modules/subscriptions/ui/components/subscribe-button";
import UserInfo from "@/modules/users/ui/components/user-info";
interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}
const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId: clerkUserId } = useAuth();
  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size={"lg"} imageUrl={user.imageUrl} name={user.name} />
          <div className="flex flex-col gap-0">
            <UserInfo name={user.name} size={"lg"} />
            <span className="line-clamp-1 text-muted-foreground text-sm">
              {0} subscribers
            </span>
          </div>
        </div>
      </Link>
      {clerkUserId == user.clerkId ? (
        <Button className="rounded-full " asChild variant={"secondary"}>
          <Link href={`/studio/videos/${videoId}`}>Edit Video</Link>
        </Button>
      ) : (
        <SubscribeButton onClick={() => {}} isSubscribed={false} />
      )}
    </div>
  );
};

export default VideoOwner;
