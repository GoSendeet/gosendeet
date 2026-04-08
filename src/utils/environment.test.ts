import { describe, expect, it } from "vitest";

import {
  isGoogleAuthEnabled,
  isNonProductionEmailValidationEnv,
} from "./environment";

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

describe("isGoogleAuthEnabled", () => {
  it("returns true in dev when no explicit flag is set", () => {
    expect(
      isGoogleAuthEnabled({ DEV: true, MODE: "development" } as ImportMetaEnv),
    ).toBe(true);
  });

  it("returns false in production when no explicit flag is set", () => {
    expect(
      isGoogleAuthEnabled({ DEV: false, MODE: "production" } as ImportMetaEnv),
    ).toBe(false);
  });

  it("allows enabling Google auth explicitly in production", () => {
    expect(
      isGoogleAuthEnabled({
        DEV: false,
        MODE: "production",
        VITE_ENABLE_GOOGLE_AUTH: "true",
      } as ImportMetaEnv),
    ).toBe(true);
  });

  it("allows disabling Google auth explicitly in dev", () => {
    expect(
      isGoogleAuthEnabled({
        DEV: true,
        MODE: "development",
        VITE_ENABLE_GOOGLE_AUTH: "false",
      } as ImportMetaEnv),
    ).toBe(false);
  });
});
