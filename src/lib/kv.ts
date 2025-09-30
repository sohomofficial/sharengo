import { Redis } from "@upstash/redis";

let kv: Redis | null = null;

export function getKV() {
  if (!kv) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      throw new Error(
        "KV_REST_API_URL and KV_REST_API_TOKEN environment variables are required"
      );
    }

    kv = new Redis({
      url,
      token,
    });
  }
  return kv;
}

export type RoomMeta = {
  code: string;
  name: string;
  createdAt: number;
  expiresAt: number; // epoch ms
  hasPin: boolean;
};

export type PhotoMeta = {
  url: string;
  uploadedBy: string;
  uploadedAt: number;
  filename: string;
};

export type PhotoWithMeta = {
  url: string;
  uploadedBy: string | null;
  uploadedAt: number | null;
  filename: string | null;
};
