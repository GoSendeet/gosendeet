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
  sessionStorage.setItem(AUTH_SESSION_KEY, "true");
  sessionStorage.setItem("userId", String(user.id ?? ""));
  sessionStorage.setItem("role", String(user.role ?? "").toLowerCase());
  sessionStorage.setItem("sessionExpired", "false");

  const profileImage = resolveProfileImage(user);
  if (profileImage) {
    sessionStorage.setItem("profileImage", profileImage);
  } else {
    sessionStorage.removeItem("profileImage");
  }
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("profileImage");
  sessionStorage.removeItem("sessionExpired");
};
