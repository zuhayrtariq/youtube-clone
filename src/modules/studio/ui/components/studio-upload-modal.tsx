"use client";
import ResponsiveModal from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { LoaderIcon, PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import StudioUploader from "./studio-uploader";

const StudioUploadModal = () => {
  const utils = trpc.useUtils();

  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video Created");
      utils.studio.getMany.invalidate();
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
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
          <StudioUploader endpoint={create.data.url} onSuccess={() => {}} />
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
