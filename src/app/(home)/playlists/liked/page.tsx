import { DEFAULT_LIMIT } from "@/constants";
import PlaylistLikedView from "@/modules/playlists/ui/views/liked-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

const PlaylistLikedPage = () => {
  void trpc.playlists.getLiked.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <PlaylistLikedView />
    </HydrateClient>
  );
};

export default PlaylistLikedPage;
