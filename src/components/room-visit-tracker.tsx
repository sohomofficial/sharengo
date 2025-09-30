"use client";

import { useEffect } from "react";
import { updateRecentRoomVisit } from "@/lib/recent-rooms";

interface RoomVisitTrackerProps {
  roomCode: string;
}

export function RoomVisitTracker({ roomCode }: RoomVisitTrackerProps) {
  useEffect(() => {
    // Update the visit time for this room
    updateRecentRoomVisit(roomCode);
  }, [roomCode]);

  return null; // This component doesn't render anything
}
