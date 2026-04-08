const NON_PRODUCTION_ENV_NAMES = new Set(["local", "development", "dev"]);

const NON_PRODUCTION_HOST_MARKERS = ["localhost", "127.0.0.1", "beta", "dev"];

const parseBooleanFlag = (value?: string) => {
  if (typeof value !== "string") return undefined;

  const normalizedValue = value.toLowerCase().trim();

  if (normalizedValue === "true") return true;
  if (normalizedValue === "false") return false;

  return undefined;
};

export const isNonProductionEmailValidationEnv = (
  env = import.meta.env,
  hostname = window.location.hostname,
) => {
  const appEnv = env.VITE_APP_ENV?.toLowerCase().trim();
  const mode = env.MODE?.toLowerCase().trim();
  const normalizedHost = hostname.toLowerCase().trim();

  if (env.DEV) {
    return true;
  }

  if (appEnv && NON_PRODUCTION_ENV_NAMES.has(appEnv)) {
    return true;
  }

  if (mode && NON_PRODUCTION_ENV_NAMES.has(mode)) {
    return true;
  }

  return NON_PRODUCTION_HOST_MARKERS.some((marker) =>
    normalizedHost.includes(marker),
  );
};

export const isGoogleAuthEnabled = (env = import.meta.env) => {
  const explicitFlag = parseBooleanFlag(env.VITE_ENABLE_GOOGLE_AUTH);

  if (typeof explicitFlag === "boolean") {
    return explicitFlag;
  }

  return env.DEV;
};
