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

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

const SuggestionsSection = ({ videoId, isManual }: SuggestionsSectionProps) => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ErrorBoundary fallback={<ErrorSkeleton />}>
        <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
};

const SuggestionsSectionSuspense = ({
  videoId,
  isManual = false,
}: SuggestionsSectionProps) => {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (page) => page.nextCursor,
      }
    );
  return (
    <div>
      <div className="hidden md:block space-y-3">
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} data={video} size={"compact"} />
          ))}
      </div>
      <div className="md:hidden space-y-3">
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <InfiniteScroll
        isManual={isManual}
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        hasNextPage={query.hasNextPage}
      />
    </div>
  );
};

export default SuggestionsSection;
