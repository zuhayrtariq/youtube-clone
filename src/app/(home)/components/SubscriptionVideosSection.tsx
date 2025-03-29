"use client";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoGridCard from "@/components/VideoGridCard";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const SubscriptionVideosSection = () => {
  return (
    <Suspense fallback={"Loading ..."}>
      <ErrorBoundary fallback={"Error..."}>
        <SubscriptionVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};
const SubscriptionVideosSectionSuspense = () => {
  const [videos, query] =
    trpc.videos.getManySubscriptions.useSuspenseInfiniteQuery(
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

export default SubscriptionVideosSection;
