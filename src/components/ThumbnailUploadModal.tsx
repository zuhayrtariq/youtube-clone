"use client";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
import React from "react";
import ResponsiveModal from "./ResponsiveModal";

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModalProps) => {
  const utils = trpc.useUtils();
  const onUploadComplete = () => {
    utils.studio.getMany.invalidate();
    utils.studio.getOne.invalidate({ videoId });
    onOpenChange(false);
  };
  return (
    <ResponsiveModal
      title="Upload a thumbnail"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex items-center justify-center">
        <UploadButton
          // disabled
          className="bg-blue-500 rounded-xl w-fit"
          endpoint={"thumbnailUploader"}
          input={{ videoId }}
          onClientUploadComplete={() => onUploadComplete()}
        />
      </div>
    </ResponsiveModal>
  );
};

export default ThumbnailUploadModal;
