import React from "react";
import { CommentsGetManyOutput } from "../../types";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquare, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
interface CommentItemProps {
  comment: CommentsGetManyOutput["items"][number];
}
const CommentItem = ({ comment }: CommentItemProps) => {
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
  return (
    <div>
      <div className="flex gap-3  ">
        <Link href={"/users/" + comment.userId}>
          <UserAvatar
            size={"lg"}
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="flex flex-col  flex-1 min-w-0">
          <div className="flex items-center  gap-3 mb-0.5">
            <Link
              href={"/users/" + comment.userId}
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
              {/* Comment Reactions */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"} className="size-8">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}>
                  <MessageSquare className="size-4" />
                  Reply
                </DropdownMenuItem>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
