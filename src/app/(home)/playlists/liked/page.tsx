import { DEFAULT_LIMIT } from "@/constants";

import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import PlaylistLikedView from "./LikedView";

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
