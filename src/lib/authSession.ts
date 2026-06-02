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

// Keys that must be shared across tabs — stored in both localStorage and sessionStorage
const AUTH_KEYS = [AUTH_SESSION_KEY, "userId", "role", "profileImage", "sessionExpired"] as const;

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

  const items: Record<string, string | null> = {
    [AUTH_SESSION_KEY]: "true",
    userId: String(user.id ?? ""),
    role: String(user.role ?? "").toLowerCase(),
    sessionExpired: "false",
    profileImage: profileImage || null,
  };

  Object.entries(items).forEach(([key, value]) => {
    if (value !== null) {
      sessionStorage.setItem(key, value);
      localStorage.setItem(key, value);
    } else {
      sessionStorage.removeItem(key);
      localStorage.removeItem(key);
    }
  });
};

export const clearAuthSession = () => {
  AUTH_KEYS.forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
};

/**
 * Copies auth keys from localStorage → sessionStorage.
 * Called once on app startup so new tabs inherit the active session.
 */
export const syncSessionFromStorage = () => {
  if (sessionStorage.getItem("userId")) return; // Already populated

  const userId = localStorage.getItem("userId");
  if (!userId) return; // No active session to sync

  AUTH_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      sessionStorage.setItem(key, value);
    }
  });
};
