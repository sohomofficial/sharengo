import { NextResponse } from "next/server";
import { getKV, type RoomMeta } from "@/lib/kv";

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

async function hashPin(pin: string) {
  const enc = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Buffer.from(digest).toString("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name: string = (body?.name || "").trim();
    const pin: string = (body?.pin || "").trim();
    const expiresInMinutes: number = Math.max(
      1,
      Math.min(60 * 24, Number(body?.expiresInMinutes) || 120)
    ); // cap at 24h

    if (!name) {
      return NextResponse.json(
        { error: "Room name required" },
        { status: 400 }
      );
    }

    const kv = getKV();

    // generate a unique code
    let code = randomCode();
    // Avoid rare collision
    const keyMeta = (c: string) => `room:${c}:meta`;
    for (let i = 0; i < 5; i++) {
      const exists = await kv.exists(keyMeta(code));
      if (!exists) break;
      code = randomCode();
    }

    const now = Date.now();
    const expiresAt = now + expiresInMinutes * 60_000;

    const meta: RoomMeta = {
      code,
      name,
      createdAt: now,
      expiresAt,
      hasPin: !!pin,
    };

    const ttlSeconds = Math.ceil((expiresAt - now) / 1000);

    // Store metadata and optional pin hash with same TTL
    const pipeline = kv.pipeline();
    pipeline.json.set(keyMeta(code), "$", meta);
    pipeline.expire(keyMeta(code), ttlSeconds);
    // Don't initialize photos list - it will be created when first photo is uploaded
    if (pin) {
      const h = await hashPin(pin);
      pipeline.set(`room:${code}:pin`, h, { ex: ttlSeconds });
    }
    await pipeline.exec();

    return NextResponse.json({ code, expiresAt });
  } catch (err: unknown) {
    console.error("Failed to create room:", err);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
