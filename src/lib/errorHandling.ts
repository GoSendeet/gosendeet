interface AxiosErrorShape {
  response?: {
    data?: unknown;
  };
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const extractMessage = (value: unknown): string | undefined => {
  if (typeof value === "string" && value.trim()) return value;

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = extractMessage(item);
      if (message) return message;
    }
    return undefined;
  }

  if (isRecord(value)) {
    if (typeof value.message === "string" && value.message.trim()) return value.message;
    if (typeof value.error === "string" && value.error.trim()) return value.error;
    for (const nestedValue of Object.values(value)) {
      const message = extractMessage(nestedValue);
      if (message) return message;
    }
  }

  return undefined;
};

export const throwApiError = (
  error: unknown,
  fallbackMessage = "Something went wrong"
): never => {
  const axiosError = error as AxiosErrorShape;
  const responseData = axiosError?.response?.data;
  const fallback = extractMessage(error) || fallbackMessage;
  const message = extractMessage(responseData) || fallback;

  if (isRecord(responseData)) {
    throw { ...responseData, message };
  }

  throw { message };
};
