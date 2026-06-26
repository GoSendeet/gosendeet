import { describe, expect, it } from "vitest";

import { parseAddressFields } from "./address";

describe("parseAddressFields", () => {
  it("parses a house-number-first manual address", () => {
    expect(
      parseAddressFields("34, Franzaki Streeet, Oshodi, Lagos"),
    ).toEqual({
      apartment: "34",
      street: "Franzaki Streeet",
      city: "Oshodi",
      state: "Lagos State",
    });
  });

  it("keeps a single comma-free street value together", () => {
    expect(parseAddressFields("12 Admiralty Way, Lagos")).toEqual({
      apartment: "",
      street: "12 Admiralty Way",
      city: "",
      state: "Lagos State",
    });
  });
});
