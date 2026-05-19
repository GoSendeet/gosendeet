import { api } from "./axios";
import { throwApiError } from "@/lib/errorHandling";

export const uploadImage = async (imageBase64: string, name?: string) => {
  try {
    const res = await api.post(`/documents/upload`, {
      image: imageBase64,
      name: name || `package-type-${Date.now()}`,
      expiration: undefined, // No expiration
    });
    return res.data;
  } catch (error: unknown) {
    throwApiError(error);
  }
};
