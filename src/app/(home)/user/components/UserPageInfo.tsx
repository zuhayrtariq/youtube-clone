import SubscribeButton from "@/components/SubscribeButton";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { UserGetOneOutput } from "@/types/users";
import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

interface UserPageInfo {
  user: UserGetOneOutput;
}

const UserPageInfo = ({ user }: UserPageInfo) => {
  const { userId, isLoaded } = useAuth();
  const clerk = useClerk();
  const {
    name,
    subscriberCount,
    imageUrl,
    clerkId,
    videoCount,
    viewerSubscribed,
  } = user;
  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: viewerSubscribed,
  });
  return (
    <div className=" py-6">
      <div className="flex flex-col md:hidden ">
        <div className="flex items-center gap-3">
          {" "}
          <UserAvatar
            imageUrl={imageUrl}
            name={name}
            size={"lg"}
            className="h-16 w-16"
            onClick={() => {
              if (clerkId == userId) {
                clerk.openUserProfile();
              }
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{name}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>
                {subscriberCount}{" "}
                {subscriberCount == 1 ? "subscriber" : "subscribers"} •{" "}
                {videoCount} {videoCount == 1 ? "video" : "videos"}
              </span>
            </div>
          </div>
        </div>
        {userId == clerkId ? (
          <Button
            variant={"secondary"}
            className="rounded-full w-full mt-3"
            asChild
          >
            <Link href={`/studio`}>Go to studio</Link>
          </Button>
        ) : (
          <SubscribeButton
            isSubscribed={user.viewerSubscribed}
            className="w-full mt-3"
            onClick={onClick}
            disabled={isPending || !isLoaded}
          />
        )}
      </div>

      <div
        className="hidden md:flex md:items-start gap-4
       "
      >
        <UserAvatar
          imageUrl={imageUrl}
          name={name}
          size={"xl"}
          className={cn(
            userId == clerkId &&
              "cursor-pointer hover:opacity-80 transition-opacity duration-300"
          )}
          onClick={() => {
            if (clerkId == userId) {
              clerk.openUserProfile();
            }
          }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold">{name}</h1>
          <div className="flex items-center gap-1 text-sm text-foreground mt-3">
            <span>
              {subscriberCount}{" "}
              {subscriberCount == 1 ? "subscriber" : "subscribers"} •{" "}
              {videoCount} {videoCount == 1 ? "video" : "videos"}
            </span>
          </div>
          {userId == clerkId ? (
            <Button
              variant={"secondary"}
              className="rounded-full  mt-3"
              asChild
            >
              <Link href={`/studio`}>Go to studio</Link>
            </Button>
          ) : (
            <SubscribeButton
              isSubscribed={user.viewerSubscribed}
              className=" mt-3"
              onClick={onClick}
              disabled={isPending || !isLoaded}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPageInfo;
