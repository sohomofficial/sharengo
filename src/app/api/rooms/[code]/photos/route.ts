import { NextResponse } from "next/server";
import { getKV } from "@/lib/kv";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  const kv = getKV();
  const meta = await kv.json.get(`room:${code}:meta`);
  if (!meta)
    return NextResponse.json(
      { error: "Room not found or expired" },
      { status: 404 }
    );

  const photos = await kv.lrange<string>(`room:${code}:photos`, 0, -1);
  const ttl = await kv.ttl(`room:${code}:meta`);

  return NextResponse.json({ photos, ttl });
}
