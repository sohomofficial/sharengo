interface RecentRoom {
  code: string;
  name: string;
  lastVisited: number;
  action: "created" | "joined";
}

const STORAGE_KEY = "sharengo_recent_rooms";
const MAX_RECENT_ROOMS = 10; // Store more but display only 5

export function addRecentRoom(
  code: string,
  name: string,
  action: "created" | "joined"
) {
  if (typeof window === "undefined") return; // Skip on server

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let rooms: RecentRoom[] = stored ? JSON.parse(stored) : [];

    // Remove existing entry for this room code if it exists
    rooms = rooms.filter((room) => room.code !== code);

    // Add new entry at the beginning
    const newRoom: RecentRoom = {
      code,
      name,
      lastVisited: Date.now(),
      action,
    };

    rooms.unshift(newRoom);

    // Keep only the most recent MAX_RECENT_ROOMS
    rooms = rooms.slice(0, MAX_RECENT_ROOMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
  } catch (error) {
    console.error("Failed to save recent room:", error);
  }
}

export function updateRecentRoomVisit(code: string) {
  if (typeof window === "undefined") return; // Skip on server

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const rooms: RecentRoom[] = JSON.parse(stored);
    const roomIndex = rooms.findIndex((room) => room.code === code);

    if (roomIndex !== -1) {
      // Update the last visited time
      rooms[roomIndex].lastVisited = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    }
  } catch (error) {
    console.error("Failed to update recent room visit:", error);
  }
}

export function getRecentRooms(): RecentRoom[] {
  if (typeof window === "undefined") return []; // Skip on server

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const rooms: RecentRoom[] = JSON.parse(stored);
      return rooms
        .toSorted((a, b) => b.lastVisited - a.lastVisited)
        .slice(0, 5);
    }
  } catch (error) {
    console.error("Failed to get recent rooms:", error);
  }

  return [];
}

export async function checkRoomStatus(code: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/rooms/${code}/check-access`);
    // Room exists if we get 200 (has access) or 401 (no access but room exists)
    return response.status === 200 || response.status === 401;
  } catch (error) {
    console.error(`Failed to check room status for ${code}:`, error);
    return false;
  }
}

export async function filterActiveRooms(): Promise<RecentRoom[]> {
  if (typeof window === "undefined") return []; // Skip on server

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const rooms: RecentRoom[] = JSON.parse(stored);
    const activeRooms: RecentRoom[] = [];

    // Check each room's status
    for (const room of rooms) {
      const isActive = await checkRoomStatus(room.code);
      if (isActive) {
        activeRooms.push(room);
      }
    }

    // Update localStorage with only active rooms
    if (activeRooms.length !== rooms.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeRooms));
    }

    return activeRooms
      .toSorted((a, b) => b.lastVisited - a.lastVisited)
      .slice(0, 5);
  } catch (error) {
    console.error("Failed to filter active rooms:", error);
    return getRecentRooms(); // Fallback to original function
  }
}

export function removeExpiredRoom(code: string) {
  if (typeof window === "undefined") return; // Skip on server

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const rooms: RecentRoom[] = JSON.parse(stored);
    const filteredRooms = rooms.filter((room) => room.code !== code);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRooms));
  } catch (error) {
    console.error("Failed to remove expired room:", error);
  }
}
