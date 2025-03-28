import { DEFAULT_LIMIT } from "@/constants";
import PlaylistHistoryView from "@/modules/playlists/ui/views/history-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

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
