/** biome-ignore-all lint/a11y/useSemanticElements: using div with role and tabIndex for file upload functionality */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircleIcon,
  DownloadIcon,
  FileIcon,
  ImageIcon,
  Trash2Icon,
  UploadCloudIcon,
  UploadIcon,
} from "lucide-react";

import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const getFileIcon = (file: FileWithPreview) => {
  const fileType = file.file.type;

  return fileType.startsWith("image/") ? (
    <ImageIcon className="size-4 opacity-60" />
  ) : (
    <FileIcon className="size-4 opacity-60" />
  );
};

export function EnhancedUploadForm({ code }: Readonly<{ code: string }>) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const maxSize = 10 * 1024 * 1024; // 10MB
  const maxFiles = 20;

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept: "image/*", // Only accept images
    initialFiles: [],
  });

  const uploadSingleFile = async (file: FileWithPreview) => {
    if (!(file.file instanceof File)) return false;

    const fd = new FormData();
    fd.append("file", file.file);
    fd.append("code", code.toUpperCase());

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Upload failed");
    }

    return true;
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    try {
      let successCount = 0;
      let failCount = 0;

      for (const file of files) {
        try {
          const success = await uploadSingleFile(file);
          if (success) successCount++;
        } catch (err) {
          console.error(`Failed to upload ${file.file.name}:`, err);
          failCount++;
        }
      }

      const successText = successCount === 1 ? "photo" : "photos";
      const failText = failCount === 1 ? "photo" : "photos";

      if (successCount > 0) {
        toast(`Successfully uploaded ${successCount} ${successText}!`);
        clearFiles();
        router.refresh();
      }

      if (failCount > 0) {
        toast(`Failed to upload ${failCount} ${failText}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast("Upload error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Drop area */}
      <div
        role="button"
        tabIndex={0}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={(e) => {
          // Only trigger file dialog if clicking on the drop area itself, not on child elements
          if (e.target === e.currentTarget) {
            openFileDialog();
          }
        }}
        onKeyDown={(e) => {
          if (
            (e.key === "Enter" || e.key === " ") &&
            e.target === e.currentTarget
          ) {
            e.preventDefault();
            openFileDialog();
          }
        }}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-56 flex-col items-center rounded-xl border border-dashed p-6 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px] data-[files]:hidden cursor-pointer"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload photos"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-3 flex size-12 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <ImageIcon className="size-5 opacity-60" />
          </div>
          <p className="mb-2 text-lg font-medium">Upload photos to the room</p>
          <p className="text-muted-foreground text-sm mb-4">
            Max {maxFiles} photos ∙ Up to {formatBytes(maxSize)} each
          </p>
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
          >
            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
            Select photos
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <>
          {/* Action bar */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium hidden sm:block">
              {files.length} photo{files.length === 1 ? "" : "s"} ready to
              upload
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={openFileDialog}>
                <UploadCloudIcon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Add more
              </Button>
              <Button variant="outline" size="sm" onClick={clearFiles}>
                <Trash2Icon
                  className="-ms-0.5 size-3.5 opacity-60"
                  aria-hidden="true"
                />
                Clear all
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={uploading || files.length === 0}
              >
                {(() => {
                  if (uploading) return "Uploading...";
                  const photoText = files.length === 1 ? "photo" : "photos";
                  return `Upload ${files.length} ${photoText}`;
                })()}
              </Button>
            </div>
          </div>

          {/* Files table */}
          <div className="bg-background overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="text-xs">
                <TableRow className="bg-muted/50">
                  <TableHead className="h-9 py-2">Name</TableHead>
                  <TableHead className="h-9 py-2">Type</TableHead>
                  <TableHead className="h-9 py-2">Size</TableHead>
                  <TableHead className="h-9 w-0 py-2 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[13px]">
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="max-w-48 py-2 font-medium">
                      <span className="flex items-center gap-2">
                        <span className="shrink-0">{getFileIcon(file)}</span>
                        <span className="truncate">{file.file.name}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-2">
                      {file.file.type.split("/")[1]?.toUpperCase() || "IMAGE"}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-2">
                      {formatBytes(file.file.size)}
                    </TableCell>
                    <TableCell className="py-2 text-right whitespace-nowrap">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground/80 hover:text-foreground size-8 hover:bg-transparent"
                        aria-label={`Preview ${file.file.name}`}
                        onClick={() => window.open(file.preview, "_blank")}
                      >
                        <DownloadIcon className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground/80 hover:text-foreground size-8 hover:bg-transparent"
                        aria-label={`Remove ${file.file.name}`}
                        onClick={() => removeFile(file.id)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-2 text-sm"
          role="alert"
        >
          <AlertCircleIcon className="size-4 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
