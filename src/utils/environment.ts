const NON_PRODUCTION_ENV_NAMES = new Set(["local", "development", "dev"]);

const NON_PRODUCTION_HOST_MARKERS = ["localhost", "127.0.0.1", "beta", "dev"];

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
