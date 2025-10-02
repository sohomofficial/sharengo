import { getKV, type RoomMeta } from "@/lib/kv";
import { EnhancedUploadForm } from "@/components/enhanced-upload-form";
import { BlurFade } from "@/components/ui/blur-fade";
import { PhotoCard } from "@/components/photo-card";
import { RoomVisitTracker } from "@/components/room-visit-tracker";
import { CountdownTimer } from "@/components/clock-timer";
import { RoomPasswordProtection } from "@/components/room-password-protection";
import { RoomShare } from "@/components/room-share";
import { cookies } from "next/headers";
import Footer from "@/components/footer";
import ErrorPage from "@/components/error-page";

async function getRoom(code: string) {
  const kv = getKV();
  const meta = await kv.json.get<RoomMeta>(`room:${code}:meta`);
  if (!meta) return null;
  const photoUrls =
    (await kv.lrange<string>(`room:${code}:photos`, 0, -1)) || [];

  // Get photo metadata for each photo
  const photos = await Promise.all(
    photoUrls.map(async (url) => {
      const photoMeta = await kv.json.get<{
        uploadedBy?: string;
        uploadedAt?: number;
        filename?: string;
      }>(`room:${code}:photo:${url}`);
      return {
        url,
        uploadedBy: photoMeta?.uploadedBy || null,
        uploadedAt: photoMeta?.uploadedAt || null,
        filename: photoMeta?.filename || null,
      };
    })
  );

  // Get original PIN for authenticated users
  let originalPin: string | null = null;
  if (meta.hasPin) {
    try {
      const cookieStore = await cookies();
      const accessCookie = cookieStore.get(`room_${code}`);
      if (accessCookie) {
        originalPin = await kv.get<string>(`room:${code}:pin:original`);
      }
    } catch {
      // Ignore errors - PIN will remain null
    }
  }

  const ttl = await kv.ttl(`room:${code}:meta`);
  return { meta, photos, ttl, pin: originalPin };
}

export default async function RoomPage({
  params,
}: Readonly<{
  params: Promise<{ code: string }>;
}>) {
  const { code: rawCode } = await params;
  const code = rawCode.toUpperCase();
  const data = await getRoom(code);

  // Get current user's cookie for ownership comparison
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(`room_${code}`)?.value || null;
  if (!data) {
    return <ErrorPage />; // Room not found or expired
  }

  const { meta, photos, ttl, pin } = data;
  const expirationTime = Date.now() + ttl * 1000; // Convert TTL seconds to future timestamp

  return (
    <RoomPasswordProtection
      roomCode={code}
      roomName={meta.name}
      hasPin={meta.hasPin}
    >
      <main className="container pb-24 sm:pb-32 mx-auto pt-16 max-w-4xl px-4 sm:px-6 lg:px-8">
        <RoomVisitTracker roomCode={code} />
        <header className="mb-6 mx-auto">
          <h1 className="text-2xl font-semibold text-balance text-center break-all">
            {meta.name}
          </h1>
          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="text-muted-foreground text-center space-y-1">
              <p>
                Room code: <b>{meta.code}</b>
              </p>
              {pin && (
                <p>
                  PIN: <b>{pin}</b>
                </p>
              )}
            </div>
            <RoomShare
              roomCode={meta.code}
              roomName={meta.name}
              hasPin={meta.hasPin}
              pin={pin}
            />
          </div>
          <div
            aria-live="polite"
            className="flex justify-center text-sm text-muted-foreground mt-4"
          >
            <div className="flex items-center gap-2">
              <span>Expires in:</span>
              <CountdownTimer
                targetTime={expirationTime}
                className="text-foreground font-semibold"
              />
            </div>
          </div>
        </header>

        <section className="mb-8">
          <EnhancedUploadForm code={code} />
        </section>

        <section className="mb-20">
          <h2 className="sr-only">Gallery</h2>
          {photos.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No photos yet. Be the first to upload!
            </p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {photos
                .filter((photo) => photo.url && photo.url.trim() !== "") // Filter out empty or invalid URLs
                .map((photo, idx) => (
                  <li key={photo.url}>
                    <BlurFade key={photo.url} delay={0.25 + idx * 0.05} inView>
                      <PhotoCard
                        src={photo.url}
                        alt={"Event photo " + (idx + 1)}
                        index={idx}
                        photo={photo}
                        roomCode={code}
                        userCookie={userCookie}
                      />
                    </BlurFade>
                  </li>
                ))}
            </ul>
          )}
        </section>
        <Footer />
      </main>
    </RoomPasswordProtection>
  );
}
