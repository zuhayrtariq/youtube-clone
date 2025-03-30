import { createTRPCRouter } from "../init";
import { categoriesRouter } from "./categories";
import { commentReactionsRouter } from "./commentReactions";
import { commentsRouter } from "./comments";
import { playlistsRouter } from "./playlists";
import { searchRouter } from "./search";
import { studioRouter } from "./studio";
import { subscriptionsRouter } from "./subscriptions";
import { suggestionsRouter } from "./suggestions";
import { usersRouter } from "./users";
import { videoReactionsRouter } from "./videoReactions";
import { videosRouter } from "./videos";
import { videoViewsRouter } from "./videoViews";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  studio: studioRouter,
  videos: videosRouter,
  videoViews: videoViewsRouter,
  videoReaction: videoReactionsRouter,
  subscriptions: subscriptionsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  suggestions: suggestionsRouter,
  search: searchRouter,
  playlists: playlistsRouter,
  users: usersRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
