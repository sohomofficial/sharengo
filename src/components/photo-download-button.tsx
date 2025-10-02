"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PhotoDownloadButtonProps {
  src: string;
  fileName?: string;
  className?: string;
}

export function PhotoDownloadButton({
  src,
  fileName,
  className = "",
}: Readonly<PhotoDownloadButtonProps>) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      // Fetch the image
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      // Create blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const defaultName = `sharengo-photo-${timestamp}.jpg`;
      link.download = fileName || defaultName;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(url);

      toast.success("Photo downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download photo");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className={`h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-0 ${className}`}
      onClick={downloadImage}
      disabled={isDownloading}
      aria-label="Download photo"
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  );
}
