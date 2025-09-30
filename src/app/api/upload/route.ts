import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import { getKV } from "@/lib/kv";

export const runtime = "nodejs"; // ensure File and Blob are supported

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const codeValue = form.get("code");
    const code = (typeof codeValue === "string" ? codeValue : "").toUpperCase();

    if (!code)
      return NextResponse.json({ error: "Missing room code" }, { status: 400 });
    if (!file)
      return NextResponse.json({ error: "Missing file" }, { status: 400 });

    // auth cookie
    const cookieStore = await cookies();
    const hasCookie = cookieStore.get(`room_${code}`);
    if (!hasCookie)
      return NextResponse.json(
        { error: "Not authorized for this room" },
        { status: 403 }
      );

    const kv = getKV();
    const meta = await kv.json.get(`room:${code}:meta`);
    if (!meta)
      return NextResponse.json(
        { error: "Room not found or expired" },
        { status: 404 }
      );

    // check blob token exists
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // upload to Blob
    const filename = `${code}/${Date.now()}-${file.name}`;
    const { url } = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // track in Redis and align TTL with room
    const ttl = await kv.ttl(`room:${code}:meta`);
    const userCookie = hasCookie.value; // Use cookie value as user identifier

    const photoMeta = {
      url,
      uploadedBy: userCookie,
      uploadedAt: Date.now(),
      filename: file.name,
    };

    const pipeline = kv.pipeline();
    pipeline.rpush(`room:${code}:photos`, url);
    pipeline.json.set(`room:${code}:photo:${url}`, "$", photoMeta);
    if (ttl > 0) {
      pipeline.expire(`room:${code}:photos`, ttl);
      pipeline.expire(`room:${code}:photo:${url}`, ttl);
    }
    await pipeline.exec();

    return NextResponse.json({ url });
  } catch (err: unknown) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
