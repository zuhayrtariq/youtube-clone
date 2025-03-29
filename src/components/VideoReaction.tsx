"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface VideoReactionProps {
  likeCount?: number;
  dislikeCount?: number;
  userReaction?: "like" | "dislike" | null | undefined;
  videoId: string;
}

const VideoReactions = ({
  likeCount = 0,
  dislikeCount = 0,
  userReaction,
  videoId,
}: VideoReactionProps) => {
  const utils = trpc.useUtils();
  const clerk = useClerk();
  const recordReaction = trpc.videoReaction.recordReaction.useMutation({
    onSuccess: () => {
      // toast.success("Reaction recorded");
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (e) => {
      if (e.data?.code == "UNAUTHORIZED") {
        clerk.openSignIn();
      } else toast.error("Can not react to video");
    },
  });

  return (
    <div className="flex items-center flex-none">
      <Button
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        variant={"secondary"}
        disabled={recordReaction.isPending}
        onClick={() =>
          recordReaction.mutate({
            reactionType: "like",
            videoId,
          })
        }
      >
        <ThumbsUpIcon
          className={cn("size-5", userReaction == "like" && "fill-black")}
        />
        {likeCount}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        className="rounded-l-none rounded-r-full  pl-3"
        variant={"secondary"}
        disabled={recordReaction.isPending}
        onClick={() =>
          recordReaction.mutate({
            reactionType: "dislike",
            videoId,
          })
        }
      >
        <ThumbsDownIcon
          className={cn("size-5", userReaction == "dislike" && "fill-black")}
        />
        {dislikeCount}
      </Button>
    </div>
  );
};

export default VideoReactions;
