"use client";
import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CommentForm from "./CommentForm";
import CommentReplies from "./CommentReplies";
import { CommentsGetManyOutput } from "@/types/comments";
import UserAvatar from "./UserAvatar";
interface CommentItemProps {
  comment: CommentsGetManyOutput["items"][number];
  variant?: "reply" | "comment";
}
const CommentItem = ({ comment, variant = "comment" }: CommentItemProps) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const utils = trpc.useUtils();
  const clerk = useClerk();
  const { userId } = useAuth();
  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success("Comment Deleted");
      utils.comments.getMany.invalidate({
        videoId: comment.videoId,
      });
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });

  const commentReaction = trpc.commentReactions.recordReaction.useMutation({
    onSuccess: () => {
      // toast.success("Reaction recorded");
      utils.comments.getMany.invalidate({
        videoId: comment.videoId,
      });
    },

    onError: (e) => {
      if (e.data?.code == "UNAUTHORIZED") clerk.openSignIn();
      else toast.error(e.message);
    },
  });

  return (
    <div>
      <div className="flex gap-3  ">
        <Link prefetch href={"/user/" + comment.userId}>
          <UserAvatar
            size={variant == "comment" ? "lg" : "sm"}
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="flex flex-col  flex-1 min-w-0">
          <div className="flex items-center  gap-3 mb-0.5">
            <Link
              href={"/user/" + comment.userId}
              className="flex items-center "
            >
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
            </Link>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
          </div>
          <div className="flex items-center w-full justify-between">
            <div className="">
              <p className="text-sm">{comment.value}</p>

              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center ">
                  <Button
                    variant={"ghost"}
                    className="size-8"
                    size={"icon"}
                    disabled={commentReaction.isPending}
                    onClick={() => {
                      commentReaction.mutate({
                        commentId: comment.id,
                        reactionType: "like",
                      });
                    }}
                  >
                    <ThumbsUpIcon
                      className={cn(
                        comment.userReaction == "like" && "fill-black"
                      )}
                    />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {comment.likeCount}
                  </span>
                  <Button
                    variant={"ghost"}
                    className="size-8"
                    size={"icon"}
                    disabled={commentReaction.isPending}
                    onClick={() => {
                      commentReaction.mutate({
                        commentId: comment.id,
                        reactionType: "dislike",
                      });
                    }}
                  >
                    <ThumbsDownIcon
                      className={cn(
                        comment.userReaction == "dislike" && "fill-black"
                      )}
                    />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {comment.dislikeCount}
                  </span>
                </div>
                {variant == "comment" && (
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => {
                      setIsReplyOpen(true);
                    }}
                    className="h-8"
                  >
                    Reply
                  </Button>
                )}
              </div>
            </div>
            {comment.user.clerkId == userId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"} className="size-8">
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {variant == "comment" && (
                    <DropdownMenuItem onClick={() => {}}>
                      <MessageSquare className="size-4" />
                      Reply
                    </DropdownMenuItem>
                  )}
                  {comment.user.clerkId === userId && (
                    <DropdownMenuItem
                      disabled={remove.isPending}
                      onClick={() => {
                        remove.mutate({
                          id: comment.id,
                        });
                      }}
                    >
                      <Trash2Icon className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {isReplyOpen && variant == "comment" && (
            <div className="mt-4 pl-14">
              <CommentForm
                videoId={comment.videoId}
                variant="reply"
                parentId={comment.id}
                onCancel={() => {
                  setIsReplyOpen(false);
                }}
                onSuccess={() => {
                  setIsReplyOpen(false);
                  setIsRepliesOpen(true);
                }}
              />
            </div>
          )}
          {comment.replyCount > 0 && variant == "comment" && (
            <div className="pl-14">
              <Button
                variant={"tertiary"}
                size={"sm"}
                onClick={() => {
                  setIsRepliesOpen((current) => !current);
                }}
              >
                {isRepliesOpen ? <ChevronUp /> : <ChevronDown />}
                {comment.replyCount} replies
              </Button>
            </div>
          )}
          {comment.replyCount > 0 && variant == "comment" && isRepliesOpen && (
            <CommentReplies parentId={comment.id} videoId={comment.videoId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
