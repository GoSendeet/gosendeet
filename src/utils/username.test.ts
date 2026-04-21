import { describe, expect, it } from "vitest";

import { createSignupUsername } from "./username";

describe("createSignupUsername", () => {
  it("appends a short unique id to the full name", () => {
    expect(createSignupUsername("Jane", "Doe", "abc12345-6789")).toBe(
      "Jane Doe-abc12345",
    );
  });

  it("normalizes spacing in the name", () => {
    expect(createSignupUsername(" Jane ", "  Doe ", "xyz98765")).toBe(
      "Jane Doe-xyz98765",
    );
  });
});
