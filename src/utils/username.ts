const FALLBACK_ID_LENGTH = 8;

const generateFallbackId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`.slice(
    0,
    FALLBACK_ID_LENGTH,
  );

export const generateUniqueId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? generateFallbackId();

export const createSignupUsername = (
  firstName: string,
  lastName: string,
  uniqueId: string = generateUniqueId(),
) => {
  const name = `${firstName} ${lastName}`.trim().replace(/\s+/g, " ");
  const normalizedId = uniqueId.replace(/-/g, "").slice(0, FALLBACK_ID_LENGTH);

  return `${name}-${normalizedId}`;
};
