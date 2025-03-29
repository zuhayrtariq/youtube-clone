import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import PlaylistHistoryView from "./HistoryView";

const PlaylistHistoryPage = () => {
  void trpc.playlists.getHistory.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <PlaylistHistoryView />
    </HydrateClient>
  );
};

export default PlaylistHistoryPage;
