import React from "react";
import PlaylistLikedSection from "../sections/playlist-liked-section";

const PlaylistLikedView = () => {
  return (
    <div className="max-w-md mb-10 px-4 pt-2.5 flex grow flex-col gap-y-6 mx-auto   w-full">
      <div>
        <h1 className="text-2xl font-bold">Liked</h1>
        <p className="text-xs text-muted-foreground">Videos you have liked</p>
      </div>
      <PlaylistLikedSection />
    </div>
  );
};

export default PlaylistLikedView;
