"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { videoUpdateSchema } from "@/db/schema";
import { trpc } from "@/trpc/client";
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcw,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_URL } from "@/constants";
import ThumbnailUploadModal from "@/components/ThumbnailUploadModal";
import ThumbnailGenerateModal from "@/components/ThumbnailGenerateModal";
import VideoPlayer from "@/components/VideoPlayer";
import ErrorSkeleton from "./ErrorSkeleton";

interface VideoFormProps {
  videoId: string;
}

const VideoForm = ({ videoId }: VideoFormProps) => {
  return (
    <Suspense fallback={<VideoFormSkeleton />}>
      <ErrorBoundary fallback={<ErrorSkeleton />}>
        <VideoFormSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};
const VideoFormSkeleton = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between  mb-6  w-full">
        <div className="space-y-2">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>

        <Skeleton className="h-9 w-20 mr-6" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="space-y-8 lg:col-span-3 ">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-56 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-20 w-36" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-8 lg:col-span-2 ">
          <div className="space-y-2">
            {/* <Skeleton className="h-5 w-24" /> */}
            <Skeleton className="h-96 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoFormSuspense = ({ videoId }: VideoFormProps) => {
  const [thumbnailOpenModal, setThumbnailOpenModal] = useState(false);
  const [generateThumbnailOpenModal, setGenerateThumbnailOpenModal] =
    useState(false);
  const router = useRouter();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const utils = trpc.useUtils();
  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      toast.success("Video updated successfully");
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({
        videoId,
      });
    },
    onError: (e) => {
      toast.error("Unable to update :" + e.message);
    },
  });
  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      toast.success("Video deleted successfully");
      utils.studio.getMany.invalidate();
      router.push("/studio");
    },
    onError: (e) => {
      toast.error("Unable to delete :" + e.message);
    },
  });
  const revalidate = trpc.videos.revalidate.useMutation({
    onSuccess: () => {
      toast.success("Video revalidated successfully");
      utils.studio.getOne.invalidate({ videoId });
    },
    onError: (e) => {
      toast.error("Unable to revalidated :" + e.message);
    },
  });

  const generateTitle = trpc.videos.generateTitle.useMutation({
    onSuccess: () => {
      // utils.studio.getMany.invalidate();
      // utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Generating title using AI", {
        description: "This may take some time",
      });
    },
    onError: (e) => {
      toast.error("Unable to generate title :" + e.message);
    },
  });

  const generateDescription = trpc.videos.generateDescription.useMutation({
    onSuccess: () => {
      // utils.studio.getMany.invalidate();
      // utils.studio.getOne.invalidate({ id: videoId });
      toast.success("Generating new description using AI", {
        description: "This may take some time",
      });
    },
    onError: (e) => {
      toast.error("Unable to generate description :" + e.message);
    },
  });

  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ videoId });
      toast.success("Video thumbnail restored successfully");
    },
    onError: (e) => {
      toast.error("Unable to delete :" + e.message);
    },
  });
  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
    await update.mutateAsync(data);
  };
  const [isCopied, setIsCopied] = useState(false);
  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setIsCopied(true);
    toast.success("Link Copied");
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const fullUrl = `${APP_URL}/videos/${videoId}`;
  return (
    <div className="mb-6">
      <ThumbnailUploadModal
        videoId={videoId}
        open={thumbnailOpenModal}
        onOpenChange={(value) => {
          form.clearErrors();
          setThumbnailOpenModal(value);
        }}
      />
      <ThumbnailGenerateModal
        videoId={videoId}
        open={generateThumbnailOpenModal}
        onOpenChange={(value) => {
          form.clearErrors();
          setGenerateThumbnailOpenModal(value);
        }}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6 ">
            <div>
              <h1 className="text-2xl font-bold">Video Details</h1>
              <p className="text-sm text-muted-foreground">
                Manage your video details
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <Button
                type="submit"
                disabled={update.isPending || !form.formState.isDirty}
              >
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      revalidate.mutate({ id: videoId });
                    }}
                  >
                    <RotateCcw className="mr-2 size-4" />
                    Revalidate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      remove.mutate({ id: videoId });
                    }}
                  >
                    <TrashIcon className="mr-2 size-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-x-2">
                        Title
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="rounded-full size-4"
                          disabled={
                            generateTitle.isPending || !video.muxTrackId
                          }
                          onClick={() => generateTitle.mutate({ id: videoId })}
                        >
                          <SparklesIcon />
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a title to your video"
                        className=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {" "}
                      <div className="flex items-center gap-x-2">
                        Description
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="rounded-full size-4"
                          disabled={
                            generateDescription.isPending || !video.muxTrackId
                          }
                          onClick={() =>
                            generateDescription.mutate({ id: videoId })
                          }
                        >
                          <SparklesIcon />
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ""}
                        rows={10}
                        placeholder="Add a description to your video"
                        className="resize-none pr-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="thumbnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className="p-0.5 border border-dashed border-neutral-400 relative h-20 w-36 group">
                        <Image
                          src={video.thumbnailUrl ?? "/placeholder.svg"}
                          className="object-cover"
                          alt="Thumbnail"
                          fill
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size={"icon"}
                              className="bg-black/50 hover:bg-black/50 absolute top-1 right-0 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                            >
                              <MoreVerticalIcon className="size-4 text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" side="right">
                            <DropdownMenuItem
                              onClick={() => setThumbnailOpenModal(true)}
                            >
                              <ImagePlusIcon className="mr-1 size-4" />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setGenerateThumbnailOpenModal(true);
                                // generateThumbnail.mutate({ id: videoId });
                              }}
                              disabled={generateThumbnailOpenModal}
                            >
                              <SparklesIcon className="mr-1 size-4" />{" "}
                              AI-generated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                restoreThumbnail.mutate({ id: videoId });
                              }}
                            >
                              <RotateCcw className="mr-1 size-4" /> Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className=" ">
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl className="w-full ">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit ">
                <div className="relative aspect-video  overflow-hidden ">
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
                <div className="flex flex-col gap-y-6 p-4">
                  <div className="flex justify-between items-center gap-x-2">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Video Link
                      </p>
                      <div className="flex items-center gap-x-2">
                        <Link prefetch href={"/videos/" + video.id}>
                          <p className="text-sm text-blue-500 line-clamp-1">
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type="button"
                          variant={"ghost"}
                          size={"icon"}
                          className="shrink-0"
                          onClick={() => {
                            onCopy();
                          }}
                          disabled={isCopied}
                        >
                          {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Video status
                      </p>
                      <p className=" capitalize">
                        {video.muxStatus || "preparing"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-xs text-muted-foreground">
                        Subtitles status
                      </p>
                      <p className=" capitalize">
                        {video.muxTrackStatus || "No subtitles"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className=" ">
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl className="w-full ">
                        <SelectTrigger>
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">
                          <Globe2Icon />
                          Public
                        </SelectItem>
                        <SelectItem value="private">
                          <LockIcon />
                          Private
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VideoForm;
