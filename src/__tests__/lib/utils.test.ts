import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "nope", "end")).toBe("base end");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
});
