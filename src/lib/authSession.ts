import {
  clearStoredUserTimezone,
  ensureCurrentUserTimezoneStored,
  storeCurrentUserTimezone,
  USER_TIMEZONE_STORAGE_KEY,
} from "./timezone";

type SessionUser = {
  id?: string | number | null;
  role?: string | null;
  profilePicture?: string | null;
  profileImage?: string | null;
  avatar?: string | null;
  imageUrl?: string | null;
  picture?: string | null;
  photoUrl?: string | null;
  photo?: string | null;
};

const AUTH_SESSION_KEY = "authSession";
const BROADCAST_CHANNEL_NAME = "auth_session_sync";

// Keys written to sessionStorage (never to localStorage)
const SESSION_ONLY_KEYS = ["userId", "role", "profileImage"] as const;
// Keys written to both storages (presence flag + expiry signal)
const LOCAL_STORAGE_KEYS = [AUTH_SESSION_KEY, "sessionExpired", USER_TIMEZONE_STORAGE_KEY] as const;
const ALL_SESSION_KEYS = [...LOCAL_STORAGE_KEYS, ...SESSION_ONLY_KEYS] as const;

const openChannel = (): BroadcastChannel | null => {
  try {
    return new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch {
    return null;
  }
};

const resolveProfileImage = (user: SessionUser) =>
  user.profilePicture ||
  user.profileImage ||
  user.avatar ||
  user.imageUrl ||
  user.picture ||
  user.photoUrl ||
  user.photo ||
  "";

export const hasAuthSession = () =>
  sessionStorage.getItem(AUTH_SESSION_KEY) === "true" &&
  Boolean(sessionStorage.getItem("userId")) &&
  Boolean(sessionStorage.getItem("role"));

export const storeAuthSession = (user: SessionUser) => {
  const profileImage = resolveProfileImage(user);
  const timezone = storeCurrentUserTimezone();

  // Clear the redirect guard (set by the axios 401 interceptor) so a future
  // genuine 401 can trigger the toast again after re-login.
  sessionStorage.removeItem("auth_redirect_in_progress"); // must match REDIRECT_IN_PROGRESS_KEY in axios.ts

  const sessionItems: Record<string, string | null> = {
    [AUTH_SESSION_KEY]: "true",
    userId: String(user.id ?? ""),
    role: String(user.role ?? "").toLowerCase(),
    sessionExpired: "false",
    profileImage: profileImage || null,
    [USER_TIMEZONE_STORAGE_KEY]: timezone,
  };

  // Write all data to sessionStorage only
  Object.entries(sessionItems).forEach(([key, value]) => {
    if (value !== null) {
      sessionStorage.setItem(key, value);
    } else {
      sessionStorage.removeItem(key);
    }
  });

  // Only write presence flags to localStorage — never userId/role/profileImage
  localStorage.setItem(AUTH_SESSION_KEY, "true");
  localStorage.setItem("sessionExpired", "false");
};

export const clearAuthSession = () => {
  ALL_SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
  LOCAL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  clearStoredUserTimezone();
};

/**
 * Requests session data from an existing tab via BroadcastChannel.
 * Returns a Promise that resolves once sync completes or the 300ms window
 * expires (meaning no existing tab is open — stale flag is cleared).
 * Called once in main.tsx before first render so route guards see a
 * populated sessionStorage on new-tab open.
 */
export const syncSessionFromStorage = (): Promise<void> => {
  return new Promise((resolve) => {
    if (sessionStorage.getItem("userId")) {
      resolve();
      return;
    }

    if (localStorage.getItem(AUTH_SESSION_KEY) !== "true") {
      resolve();
      return;
    }

    const channel = openChannel();
    if (!channel) {
      // BroadcastChannel unsupported — clear the stale flag and give up
      localStorage.removeItem(AUTH_SESSION_KEY);
      resolve();
      return;
    }

    const done = () => {
      try { channel.close(); } catch { /* ignore */ }
      resolve();
    };

    // If no existing tab responds within 300ms the flag is stale
    // (browser was closed without logout) — clear it and start fresh
    const timeout = setTimeout(() => {
      localStorage.removeItem(AUTH_SESSION_KEY);
      done();
    }, 300);

    channel.onmessage = (event: MessageEvent) => {
      if (event.data?.type === "SESSION_DATA") {
        clearTimeout(timeout);
        const { userId, role, profileImage } = event.data;
        if (userId) {
          const timezone = ensureCurrentUserTimezoneStored();
          sessionStorage.setItem(AUTH_SESSION_KEY, "true");
          sessionStorage.setItem("userId", String(userId));
          sessionStorage.setItem("role", String(role ?? ""));
          if (profileImage) sessionStorage.setItem("profileImage", String(profileImage));
          sessionStorage.setItem("sessionExpired", "false");
          sessionStorage.setItem(USER_TIMEZONE_STORAGE_KEY, timezone);
        }
        done();
      }
    };

    channel.postMessage({ type: "REQUEST_SESSION" });
  });
};

/**
 * Registers this tab as a session data provider.
 * When a new tab broadcasts REQUEST_SESSION, this tab replies with its
 * sessionStorage data. Returns a cleanup function.
 */
export const setupCrossTabSync = (): (() => void) => {
  const channel = openChannel();
  if (!channel) return () => {};

  const handler = (event: MessageEvent) => {
    if (event.data?.type === "REQUEST_SESSION") {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        const timezone = ensureCurrentUserTimezoneStored();
        channel.postMessage({
          type: "SESSION_DATA",
          userId,
          role: sessionStorage.getItem("role") ?? "",
          profileImage: sessionStorage.getItem("profileImage") ?? "",
          timezone,
        });
      }
    }
  };

  channel.addEventListener("message", handler);
  return () => { try { channel.close(); } catch { /* ignore */ } };
};
