import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getKV } from "@/lib/kv";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  const kv = getKV();

  // Check if room exists
  const meta = await kv.json.get(`room:${code}:meta`);
  if (!meta) {
    return NextResponse.json(
      { error: "Room not found or expired" },
      { status: 404 }
    );
  }

  // Check if user has access cookie
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(`room_${code}`);

  if (accessCookie) {
    return NextResponse.json({ hasAccess: true });
  } else {
    return NextResponse.json({ hasAccess: false }, { status: 401 });
  }
}
