"use client";
import ErrorSkeleton from "@/app/(studio)/components/ErrorSkeleton";
import LoadingSkeleton from "@/app/(studio)/components/LoadingSkeleton";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoGridCard from "@/components/VideoGridCard";
import VideoRowCard from "@/components/VideoRowCard";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

const ResultsSection = ({ query, categoryId }: ResultsSectionProps) => {
  return (
    <Suspense key={`${query}-${categoryId}`} fallback={<LoadingSkeleton />}>
      <ErrorBoundary fallback={<ErrorSkeleton />}>
        <ResultsSectionSuspense query={query} categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ResultsSectionSuspense = ({ query, categoryId }: ResultsSectionProps) => {
  const isMobile = useIsMobile();
  const [results, resultsQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} size={"default"} />
            ))}
        </div>
      )}
      <InfiniteScroll
        fetchNextPage={resultsQuery.fetchNextPage}
        hasNextPage={resultsQuery.hasNextPage}
        isFetchingNextPage={resultsQuery.isFetchingNextPage}
      />
    </>
  );
};

export default ResultsSection;
