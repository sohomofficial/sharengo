"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PhotoDeleteButtonProps {
  photoUrl: string;
  roomCode: string;
  className?: string;
}

export function PhotoDeleteButton({
  photoUrl,
  roomCode,
  className = "",
}: Readonly<PhotoDeleteButtonProps>) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const deletePhoto = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/rooms/${roomCode}/photos/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoUrl,
          code: roomCode,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete photo");
      }

      toast.success("Photo deleted successfully!");
      router.refresh(); // Refresh the page to update the gallery
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete photo"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="destructive"
      className={`h-8 w-8 bg-red-500/80 hover:bg-red-600/90 text-white border-0 ${className}`}
      onClick={deletePhoto}
      disabled={isDeleting}
      aria-label="Delete photo"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}
