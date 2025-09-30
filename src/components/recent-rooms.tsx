"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, ExternalLink } from "lucide-react";
import Link from "next/link";

interface RecentRoom {
  code: string;
  name: string;
  lastVisited: number;
  action: "created" | "joined";
}

export function RecentRooms() {
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get recent rooms from localStorage
    const loadRecentRooms = () => {
      try {
        const stored = localStorage.getItem("sharengo_recent_rooms");
        if (stored) {
          const rooms: RecentRoom[] = JSON.parse(stored);
          // Sort by lastVisited (most recent first) and take only 5
          const sortedRooms = rooms
            .toSorted((a, b) => b.lastVisited - a.lastVisited)
            .slice(0, 5);
          setRecentRooms(sortedRooms);
        }
      } catch (error) {
        console.error("Failed to load recent rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentRooms();
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
            Recent Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-foreground"></div>
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
            Recent Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent rooms yet</p>
            <p className="text-sm">Create or join a room to see your history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-4" />
          Recent Rooms
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
