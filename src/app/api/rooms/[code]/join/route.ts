import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getKV } from "@/lib/kv";

async function hashPin(pin: string) {
  const enc = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Buffer.from(digest).toString("hex");
}

export async function POST(
  req: Request,
  { params }: { params: { code: string } }
) {
  const code = params.code.toUpperCase();
  const kv = getKV();
  const meta = await kv.json.get(`room:${code}:meta`);
  if (!meta)
    return NextResponse.json(
      { error: "Room not found or expired" },
      { status: 404 }
    );

  const hasPin = await kv.exists(`room:${code}:pin`);
  if (hasPin) {
    const body = await req.json().catch(() => ({}));
    const pin = (body?.pin || "").trim();
    if (!pin)
      return NextResponse.json({ error: "PIN required" }, { status: 400 });
    const submittedHash = await hashPin(pin);
    const storedHash = await kv.get<string>(`room:${code}:pin`);
    if (submittedHash !== storedHash) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 403 });
    }
  }

  // Cookie lifetime: min(remaining TTL, 24h)
  const ttl = await kv.ttl(`room:${code}:meta`);
  const maxAge = Math.max(60, Math.min(ttl > 0 ? ttl : 3600, 24 * 3600));
  const cookieStore = await cookies();
  cookieStore.set(`room_${code}`, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: `/`,
    maxAge,
  });

  // set uid cookie if missing (non-HTTPOnly so client UI can compare ownership)
  if (!cookieStore.get("uid")?.value) {
    cookieStore.set("uid", crypto.randomUUID(), {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  }

  return NextResponse.json({
    ok: true,
    room: meta,
  });
}
