"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { LoaderIcon, PlusIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import StudioUploader from "./StudioUploader";
import ResponsiveModal from "./ResponsiveModal";

const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Upload a video");
      utils.studio.getMany.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const onSuccess = () => {
    if (!create.data?.video.id) {
      return;
    }
    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };
  return (
    <>
      <ResponsiveModal
        title="Upload a Video"
        open={!!create.data?.url}
        onOpenChange={() => {
          create.reset();
        }}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data.url} onSuccess={onSuccess} />
        ) : (
          <LoaderIcon />
        )}
      </ResponsiveModal>
      <Button
        variant={"secondary"}
        className="font-medium"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <LoaderIcon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
};

export default StudioUploadModal;
