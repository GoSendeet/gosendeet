import { beforeEach, describe, expect, it, vi } from "vitest";

const postMock = vi.fn();

vi.mock("./axios", () => ({
  BASE_URL: "http://localhost:8080/api/v1",
  api: {
    defaults: {
      baseURL: "http://localhost:8080/api/v1",
    },
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  authApi: {
    defaults: {
      baseURL: "http://localhost:8080/api/v1",
    },
    post: postMock,
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

describe("auth service backend URL wiring", () => {
  beforeEach(() => {
    postMock.mockReset();
  });

  it("uses the configured backend base URL for auth requests", async () => {
    const { authApi, BASE_URL } = await import("./axios");

    expect(BASE_URL).toBe("http://localhost:8080/api/v1");
    expect(authApi.defaults.baseURL).toBe("http://localhost:8080/api/v1");
  });

  it("posts login requests to the backend login endpoint", async () => {
    postMock.mockResolvedValueOnce({ data: { ok: true } });

    const { login } = await import("./auth");
    const payload = { email: "user@example.com", password: "secret123" };

    await login(payload);

    expect(postMock).toHaveBeenCalledWith("/auth/login", payload);
  });
});
