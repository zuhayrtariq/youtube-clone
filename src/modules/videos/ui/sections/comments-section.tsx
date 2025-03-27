"use client";
import InfiniteScroll from "@/components/infinite-scroll";
import { DEFAULT_COMMENTS_LIMIT } from "@/constants";
import CommentForm from "@/modules/comments/ui/components/comment-form";
import CommentItem from "@/modules/comments/ui/components/comment-item";
import { trpc } from "@/trpc/client";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentsSectionProps {
  videoId: string;
}
const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  return (
    <Suspense fallback={<CommentsSectionSkeleton />}>
      <ErrorBoundary fallback={"Error..."}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CommentsSectionSkeleton = () => {
  return (
    <div className="flex justify-center items-center mt-6">
      <Loader2Icon className="text-muted-foreground animate-spin size-7" />
    </div>
  );
};

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId: videoId,
      limit: DEFAULT_COMMENTS_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-bold">
          {comments.pages[0].totalCount} comments
        </h1>
        <CommentForm videoId={videoId} />
        <div className="flex flex-col gap-4 mt-2">
          {comments.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          <InfiniteScroll
            isManual
            fetchNextPage={query.fetchNextPage}
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
