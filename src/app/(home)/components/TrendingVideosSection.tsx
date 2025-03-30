"use client";
import ErrorSkeleton from "@/app/(studio)/components/ErrorSkeleton";
import LoadingSkeleton from "@/app/(studio)/components/LoadingSkeleton";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoGridCard from "@/components/VideoGridCard";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const TrendingVideosSection = () => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ErrorBoundary fallback={<ErrorSkeleton />}>
        <TrendingVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
const TrendingVideosSectionSuspense = () => {
  const [videos, query] = trpc.videos.getManyTrending.useSuspenseInfiniteQuery(
    {
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

export default TrendingVideosSection;
