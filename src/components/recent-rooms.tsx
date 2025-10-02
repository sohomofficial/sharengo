"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, RefreshCw, Telescope } from "lucide-react";
import Link from "next/link";
import { filterActiveRooms } from "@/lib/recent-rooms";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentRoom {
  code: string;
  name: string;
  lastVisited: number;
  action: "created" | "joined";
}

export function RecentRooms() {
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshRooms = async () => {
    setIsLoading(true);
    try {
      const activeRooms = await filterActiveRooms();
      setRecentRooms(activeRooms);
    } catch (error) {
      console.error("Failed to refresh rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Get active recent rooms and filter out expired ones
    const loadActiveRecentRooms = async () => {
      try {
        const activeRooms = await filterActiveRooms();
        setRecentRooms(activeRooms);
      } catch (error) {
        console.error("Failed to load active recent rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActiveRecentRooms();
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-4" />
            Recent Active Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => `loading-${i}`).map((id) => (
              <div
                key={id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-16" />
                    <span className="text-muted-foreground">•</span>
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentRooms.length === 0) {
    return (
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-4" />
            Recent Active Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Telescope className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No active rooms found</p>
            <p className="text-sm">Create or join a room to see your history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            Recent Active Rooms
          </div>
          <Button
            onClick={refreshRooms}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="sr-only">Refresh rooms</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentRooms.map((room) => (
            <div
              key={room.code}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{room.name}</h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      room.action === "created"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {room.action}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-mono font-medium">{room.code}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(room.lastVisited)}</span>
                </div>
              </div>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="ml-2 h-8 w-8 p-0"
              >
                <Link href={`/room/${room.code}`}>
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open room {room.code}</span>
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
