import React from "react";
import { CommentsGetManyOutput } from "../../types";
import Link from "next/link";
import UserAvatar from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
interface CommentItemProps {
  comment: CommentsGetManyOutput[number];
}
const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div>
      <div className="flex gap-4">
        <Link href={"/users/" + comment.userId}>
          <UserAvatar
            size={"lg"}
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="flex flex-col flex-1 min-w-0">
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
          <div className="">
            <p className="text-sm">{comment.value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
