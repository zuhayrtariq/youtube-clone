"use client";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import React from "react";
import VideoRowCard from "../components/video-row-card";
import VideoGridCard from "../components/video-grid-card";
import InfiniteScroll from "@/components/infinite-scroll";

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

const SuggestionsSection = ({
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
    <>
      <div className="hidden md:block space-y-3">
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} data={video} size={"default"} />
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
    </>
  );
};

export default SuggestionsSection;
