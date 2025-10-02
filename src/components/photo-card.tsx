"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { PhotoDownloadButton } from "@/components/photo-download-button";
import { PhotoDeleteButton } from "./photo-delete-button";
import { Skeleton } from "@/components/ui/skeleton";

interface PhotoCardProps {
  src: string;
  alt: string;
  index: number;
  photo: {
    url: string;
    uploadedBy: string | null;
    uploadedAt: number | null;
    filename: string | null;
  };
  roomCode: string;
  userCookie: string | null;
}

export function PhotoCard({
  src,
  alt,
  index,
  photo,
  roomCode,
  userCookie,
}: Readonly<PhotoCardProps>) {
  const [isLoading, setIsLoading] = useState(true);
  const canDelete =
    photo.uploadedBy && userCookie && photo.uploadedBy === userCookie;

  return (
    <div className="group relative overflow-hidden rounded-md border">
      {isLoading && <Skeleton className="w-full aspect-square" />}
      <ImageZoom>
        <Image
          src={src}
          alt={alt}
          className={`w-full aspect-square object-cover transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          width={400}
          height={300}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </ImageZoom>

      {/* Action buttons - always visible on mobile, appears on hover on desktop */}
      <div className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-1">
          <PhotoDownloadButton src={src} fileName={`photo-${index + 1}.jpg`} />
          {canDelete && (
            <PhotoDeleteButton photoUrl={photo.url} roomCode={roomCode} />
          )}
        </div>
      </div>
    </div>
  );
}
