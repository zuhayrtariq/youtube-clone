"use client";
import InfiniteScroll from "@/components/InfiniteScroll";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VideoThumbnail from "@/components/VideoThumbnail";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorSkeleton from "./ErrorSkeleton";

const VideosSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<ErrorSkeleton />}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <div className="border-y">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6 w-[510px]">Video</TableHead>
            <TableHead className="">Visibility</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Date</TableHead>
            <TableHead className="text-right">Views</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right pr-6">Likes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <div className="flex  items-center gap-4">
                  <div className="relative aspect-video w-36 ">
                    <Skeleton className="w-36 h-20" />
                  </div>
                  <div className="flex  flex-col overflow-hidden gap-y-1">
                    <span className="text-sm line-clamp-1">
                      <Skeleton className="w-24 h-4" />
                    </span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      <Skeleton className="w-12 h-4" />
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex  items-center gap-x-1 capitalize ">
                  <Skeleton className="w-16 h-4" />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex  items-center capitalize">
                  <Skeleton className="w-16 h-4" />
                </div>
              </TableCell>
              <TableCell className="text-sm truncate">
                <Skeleton className="w-16 h-4" />
              </TableCell>
              <TableCell className="text-right ">
                <div className="text-right flex  justify-end">
                  <Skeleton className="w-8 h-4" />
                </div>
              </TableCell>
              <TableCell className="text-right ">
                <div className="text-right flex  justify-end">
                  <Skeleton className="w-8 h-4" />
                </div>
              </TableCell>
              <TableCell className="text-right  pr-6">
                <div className="text-right flex  justify-end">
                  <Skeleton className="w-8 h-4" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
const VideosSectionSuspense = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div className="">
      <div className="border-y">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead className="">Visibility</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="">Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <Link
                  href={"/studio/videos/" + video.id}
                  key={video.id}
                  legacyBehavior
                >
                  <TableRow className="cursor-pointer">
                    <TableCell className="font-medium  ">
                      <div className="flex  items-center gap-4 ">
                        <div className="relative aspect-video w-36 shrink-0">
                          <VideoThumbnail
                            title={video.title}
                            thumbnailUrl={video.thumbnailUrl}
                            previewUrl={video.previewUrl}
                            duration={video.duration || 0}
                          />
                        </div>
                        <div className="flex  flex-col  overflow-hidden gap-y-1 max-w-[300px] ">
                          <span className="text-sm line-clamp-1 truncate">
                            {video.title}
                          </span>
                          <span className="text-xs text-muted-foreground  truncate ">
                            {video.description}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex  items-center gap-x-1 capitalize ">
                        {video.visibility == "private" ? (
                          <LockIcon className="size-4" />
                        ) : (
                          <Globe2Icon className="size-4" />
                        )}
                        {video.visibility}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex  items-center capitalize">
                        {video.muxStatus}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm truncate">
                      {format(new Date(video.createdAt), "d MMM yyyy")}
                    </TableCell>
                    <TableCell className=" text-right">
                      {video.views} Views
                    </TableCell>
                    <TableCell className="text-right"> Comments</TableCell>
                    <TableCell className="text-right pr-6">Likes</TableCell>
                  </TableRow>
                </Link>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        isManual
        fetchNextPage={query.fetchNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        hasNextPage={query.hasNextPage}
      />
    </div>
  );
};

export default VideosSection;
