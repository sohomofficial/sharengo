// This utility can be used to migrate existing photos to have metadata
// Run this if you have existing photos without ownership information

import { getKV } from "@/lib/kv";

export async function migrateLegacyPhotos(roomCode: string) {
  const kv = getKV();
  const photoUrls =
    (await kv.lrange<string>(`room:${roomCode}:photos`, 0, -1)) || [];

  for (const url of photoUrls) {
    const exists = await kv.exists(`room:${roomCode}:photo:${url}`);
    if (!exists) {
      // Create metadata for legacy photo with unknown owner
      const photoMeta = {
        url,
        uploadedBy: "legacy-user", // Mark as legacy
        uploadedAt: Date.now(),
        filename: "unknown",
      };

      const ttl = await kv.ttl(`room:${roomCode}:meta`);
      await kv.json.set(`room:${roomCode}:photo:${url}`, "$", photoMeta);
      if (ttl > 0) {
        await kv.expire(`room:${roomCode}:photo:${url}`, ttl);
      }
    }
  }
}
