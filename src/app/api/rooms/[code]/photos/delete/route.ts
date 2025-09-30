import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { del } from "@vercel/blob";
import { getKV } from "@/lib/kv";

export const runtime = "nodejs";

export async function DELETE(req: Request) {
  try {
    const { photoUrl, code } = await req.json();

    if (!code || !photoUrl) {
      return NextResponse.json(
        { error: "Missing room code or photo URL" },
        { status: 400 }
      );
    }

    const upperCode = code.toUpperCase();

    // Check auth cookie
    const cookieStore = await cookies();
    const hasCookie = cookieStore.get(`room_${upperCode}`);
    if (!hasCookie) {
      return NextResponse.json(
        { error: "Not authorized for this room" },
        { status: 403 }
      );
    }

    const kv = getKV();

    // Check if room exists
    const meta = await kv.json.get(`room:${upperCode}:meta`);
    if (!meta) {
      return NextResponse.json(
        { error: "Room not found or expired" },
        { status: 404 }
      );
    }

    // Get photo metadata to check ownership
    const photoMeta = await kv.json.get(`room:${upperCode}:photo:${photoUrl}`);
    if (!photoMeta) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Check if user owns this photo (using cookie value as user identifier)
    const userCookie = hasCookie.value;
    const photoData = photoMeta as { uploadedBy?: string } | null;
    if (!photoData?.uploadedBy || photoData.uploadedBy !== userCookie) {
      return NextResponse.json(
        { error: "You can only delete photos you uploaded" },
        { status: 403 }
      );
    }

    // Delete from Vercel Blob
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(photoUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
      } catch (error) {
        console.error("Failed to delete from blob storage:", error);
        // Continue with Redis cleanup even if blob deletion fails
      }
    }

    // Remove from Redis
    const pipeline = kv.pipeline();
    pipeline.lrem(`room:${upperCode}:photos`, 0, photoUrl);
    pipeline.del(`room:${upperCode}:photo:${photoUrl}`);
    await pipeline.exec();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete photo error:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
