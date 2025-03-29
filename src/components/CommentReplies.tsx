import { DEFAULT_COMMENTS_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { CornerDownRightIcon, Loader2Icon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import CommentItem from "./CommentItem";
interface CommentRepliesProps {
  videoId: string;
  parentId: string;
}
const CommentReplies = ({ parentId, videoId }: CommentRepliesProps) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        limit: DEFAULT_COMMENTS_LIMIT,
        videoId,
        parentId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  return (
    <div className="pl-14 ">
      <div className="flex flex-col mt-2 gap-4">
        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader2Icon className="text-muted-foreground animate-spin size-6" />
          </div>
        )}
        {!isLoading &&
          data?.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} variant="reply" comment={comment} />
            ))}
      </div>
      {hasNextPage && (
        <Button
          variant={"tertiary"}
          size={"sm"}
          onClick={() => {
            fetchNextPage();
          }}
          disabled={isFetchingNextPage}
          className=""
        >
          <CornerDownRightIcon />
          Show more replies
        </Button>
      )}
    </div>
  );
};

export default CommentReplies;
