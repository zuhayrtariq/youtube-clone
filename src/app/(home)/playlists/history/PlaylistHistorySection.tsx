"use client";
import ErrorSkeleton from "@/app/(studio)/components/ErrorSkeleton";
import LoadingSkeleton from "@/app/(studio)/components/LoadingSkeleton";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoGridCard from "@/components/VideoGridCard";
import VideoRowCard from "@/components/VideoRowCard";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const PlaylistHistorySection = () => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ErrorBoundary fallback={<ErrorSkeleton />}>
        <PlaylistHistorySectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
const PlaylistHistorySectionSuspense = () => {
  const [videos, query] = trpc.playlists.getHistory.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <>
      <div className="flex flex-col gap-y-10 gap-4 md:hidden ">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard data={video} key={video.id} />
          ))}
      </div>
      <div className="md:flex flex-col  gap-4 hidden ">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard data={video} key={video.id} size={"compact"} />
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

export default PlaylistHistorySection;
