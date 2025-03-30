"use client";
import ErrorSkeleton from "@/app/(studio)/components/ErrorSkeleton";
import LoadingSkeleton from "@/app/(studio)/components/LoadingSkeleton";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoGridCard from "@/components/VideoGridCard";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface HomeVideosSectionProps {
  categoryId?: string;
}

const HomeVideosSection = ({ categoryId }: HomeVideosSectionProps) => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ErrorBoundary fallback={<ErrorSkeleton />}>
        <HomeVideosSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};
const HomeVideosSectionSuspense = ({ categoryId }: HomeVideosSectionProps) => {
  const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
    {
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <>
      <div
        className="grid gap-y-10 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
      
      "
      >
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard data={video} key={video.id} />
          ))}
      </div>
      <InfiniteScroll
        fetchNextPage={query.fetchNextPage}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
      />
    </>
  );
};

export default HomeVideosSection;
