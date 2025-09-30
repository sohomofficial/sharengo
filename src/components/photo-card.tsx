"use client";

import Image from "next/image";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { PhotoDownloadButton } from "@/components/photo-download-button";
import { PhotoDeleteButton } from "./photo-delete-button";

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
  const canDelete =
    photo.uploadedBy && userCookie && photo.uploadedBy === userCookie;
  return (
    <div className="group relative overflow-hidden rounded-md border">
      <ImageZoom>
        <Image
          src={src}
          alt={alt}
          className="w-full aspect-square object-cover"
          width={400}
          height={300}
          loading="lazy"
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
