import { getKV, type RoomMeta } from "@/lib/kv";
import { EnhancedUploadForm } from "@/components/enhanced-upload-form";
import { BlurFade } from "@/components/ui/blur-fade";
import { PhotoCard } from "@/components/photo-card";
import { RoomVisitTracker } from "@/components/room-visit-tracker";
import { CountdownTimer } from "@/components/clock-timer";
import { RoomPasswordProtection } from "@/components/room-password-protection";
import { cookies } from "next/headers";
import Footer from "@/components/footer";

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

  const ttl = await kv.ttl(`room:${code}:meta`);
  return { meta, photos, ttl };
}

export default async function RoomPage({
  params,
}: Readonly<{
  params: { code: string };
}>) {
  const code = params.code.toUpperCase();
  const data = await getRoom(code);

  // Get current user's cookie for ownership comparison
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(`room_${code}`)?.value || null;
  if (!data) {
    return (
      <main className="container mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">Room not found or expired</h1>
      </main>
    );
  }

  const { meta, photos, ttl } = data;
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
          <p className="text-muted-foreground text-center mt-4">
            Room code: <b>{meta.code}</b>
          </p>
          <div
            aria-live="polite"
            className="flex justify-center text-sm text-muted-foreground"
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
