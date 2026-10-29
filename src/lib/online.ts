import { broadcastLobbyEvent, subscribeToCrossTab } from "@/integrations/supabase/mock-client";
import { type GameState } from "@/game/engine";

export interface OnlineRoom {
  code: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  guestId?: string;
  guestName?: string;
  guestAvatar?: string;
  status: "waiting" | "playing" | "finished";
  createdAt: number;
  gameState?: GameState;
  hostColor: string;
  guestColor: string;
  timer: number;
  rounds: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

export interface FriendRequest {
  id: string;
  fromId: string;
  fromName: string;
  fromAvatar: string;
  toId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: number;
}

const STORAGE_KEY_ROOMS = "varasaata_rooms_v1";
const STORAGE_KEY_FRIENDS = "varasaata_friends_v1";
const STORAGE_KEY_REQUESTS = "varasaata_requests_v1";

function getStored<T>(key: string, def: T): T {
  if (typeof window === "undefined") return def;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : def;
  } catch {
    return def;
  }
}

function setStored<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* storage quota or private mode */
  }
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let res = "";
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

// Room Management
export function createRoom(
  hostId: string,
  hostName: string,
  hostAvatar: string,
  options: { hostColor: string; guestColor: string; timer: number; rounds: number },
): OnlineRoom {
  const code = generateRoomCode();
  const room: OnlineRoom = {
    code,
    hostId,
    hostName,
    hostAvatar,
    status: "waiting",
    createdAt: Date.now(),
    hostColor: options.hostColor,
    guestColor: options.guestColor,
    timer: options.timer,
    rounds: options.rounds,
  };
  const rooms = getStored<Record<string, OnlineRoom>>(STORAGE_KEY_ROOMS, {});
  rooms[code] = room;
  setStored(STORAGE_KEY_ROOMS, rooms);
  broadcastLobbyEvent("room_created", room);
  return room;
}

export function getRoom(code: string): OnlineRoom | null {
  const rooms = getStored<Record<string, OnlineRoom>>(STORAGE_KEY_ROOMS, {});
  return rooms[code.trim().toUpperCase()] || null;
}

export function joinRoom(
  code: string,
  guestId: string,
  guestName: string,
  guestAvatar: string,
): OnlineRoom | null {
  const norm = code.trim().toUpperCase();
  const rooms = getStored<Record<string, OnlineRoom>>(STORAGE_KEY_ROOMS, {});
  const room = rooms[norm];
  if (!room) return null;
  if (room.hostId === guestId) return room; // Host re-entering

  room.guestId = guestId;
  room.guestName = guestName;
  room.guestAvatar = guestAvatar;
  room.status = "playing";
  rooms[norm] = room;
  setStored(STORAGE_KEY_ROOMS, rooms);
  broadcastLobbyEvent("player_joined", room);
  return room;
}

export function updateRoomGame(code: string, gameState: GameState): void {
  const norm = code.trim().toUpperCase();
  const rooms = getStored<Record<string, OnlineRoom>>(STORAGE_KEY_ROOMS, {});
  const room = rooms[norm];
  if (!room) return;
  room.gameState = gameState;
  if (gameState.winner !== null) room.status = "finished";
  rooms[norm] = room;
  setStored(STORAGE_KEY_ROOMS, rooms);
  broadcastLobbyEvent("game_move", { code: norm, gameState });
}

// Friends Management
export function getFriends(userId: string): Friend[] {
  const friendsMap = getStored<Record<string, Friend[]>>(STORAGE_KEY_FRIENDS, {});
  const list = friendsMap[userId] || [];
  // Seed sample interactive bots/friends if list is empty
  if (list.length === 0) {
    const defaults: Friend[] = [
      { id: "f1", name: "Kavya", avatar: "🪷", online: true },
      { id: "f2", name: "Rahul_Telugu", avatar: "🐅", online: true },
      { id: "f3", name: "Vikram", avatar: "🐘", online: false },
    ];
    friendsMap[userId] = defaults;
    setStored(STORAGE_KEY_FRIENDS, friendsMap);
    return defaults;
  }
  return list;
}

export function getFriendRequests(userId: string): FriendRequest[] {
  const requests = getStored<FriendRequest[]>(STORAGE_KEY_REQUESTS, []);
  return requests.filter((r) => r.toId === userId && r.status === "pending");
}

export function sendFriendRequest(
  fromUser: { id: string; name: string; avatar: string },
  toUsername: string,
): { success: boolean; message: string } {
  const clean = toUsername.trim();
  if (!clean || clean.length < 2)
    return { success: false, message: "Please enter a valid player username." };
  if (clean.toLowerCase() === fromUser.name.toLowerCase())
    return { success: false, message: "You cannot add yourself as a friend." };

  const requests = getStored<FriendRequest[]>(STORAGE_KEY_REQUESTS, []);
  const req: FriendRequest = {
    id: "req_" + Math.random().toString(36).substring(2, 9),
    fromId: fromUser.id,
    fromName: fromUser.name,
    fromAvatar: fromUser.avatar,
    toId: "to_" + clean,
    status: "pending",
    createdAt: Date.now(),
  };
  requests.push(req);
  setStored(STORAGE_KEY_REQUESTS, requests);
  broadcastLobbyEvent("friend_request", req);

  // Automatically add to sender's list as connected player
  const friendsMap = getStored<Record<string, Friend[]>>(STORAGE_KEY_FRIENDS, {});
  const current = friendsMap[fromUser.id] || [];
  if (!current.some((f) => f.name.toLowerCase() === clean.toLowerCase())) {
    current.push({
      id: "f_" + clean,
      name: clean,
      avatar: ["🦚", "🐅", "🐘", "🪷", "🦁"][Math.floor(Math.random() * 5)],
      online: true,
    });
    friendsMap[fromUser.id] = current;
    setStored(STORAGE_KEY_FRIENDS, friendsMap);
  }

  return { success: true, message: `Friend request sent to ${clean}!` };
}

export function acceptFriendRequest(userId: string, reqId: string): void {
  const requests = getStored<FriendRequest[]>(STORAGE_KEY_REQUESTS, []);
  const req = requests.find((r) => r.id === reqId);
  if (!req) return;
  req.status = "accepted";
  setStored(STORAGE_KEY_REQUESTS, requests);

  const friendsMap = getStored<Record<string, Friend[]>>(STORAGE_KEY_FRIENDS, {});
  const current = friendsMap[userId] || [];
  if (!current.some((f) => f.id === req.fromId)) {
    current.push({
      id: req.fromId,
      name: req.fromName,
      avatar: req.fromAvatar,
      online: true,
    });
    friendsMap[userId] = current;
    setStored(STORAGE_KEY_FRIENDS, friendsMap);
  }
  broadcastLobbyEvent("friend_accepted", { userId, friend: req });
}
