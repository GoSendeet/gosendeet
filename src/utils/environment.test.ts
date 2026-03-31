import { describe, expect, it } from "vitest";

import { isNonProductionEmailValidationEnv } from "./environment";

describe("isNonProductionEmailValidationEnv", () => {
  it("returns true for local vite dev mode", () => {
    expect(
      isNonProductionEmailValidationEnv(
        { DEV: true, MODE: "development" } as ImportMetaEnv,
        "localhost",
      ),
    ).toBe(true);
  });

  it("returns true for shared dev environments", () => {
    expect(
      isNonProductionEmailValidationEnv(
        { DEV: false, MODE: "production", VITE_APP_ENV: "dev" } as ImportMetaEnv,
        "gosendeet-beta.vercel.app",
      ),
    ).toBe(true);
  });

  it("returns false for production environments", () => {
    expect(
      isNonProductionEmailValidationEnv(
        { DEV: false, MODE: "production", VITE_APP_ENV: "production" } as ImportMetaEnv,
        "gosendeet.com",
      ),
    ).toBe(false);
  });
});
