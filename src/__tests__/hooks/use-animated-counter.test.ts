import { describe, it, expect } from "vitest";
import { easeOutQuartValue } from "@/hooks/use-animated-counter";

/**
 * Tests the pure easing math exported for testability.
 * renderHook-based tests are deferred until Node ≥ 20 / jsdom compat is resolved.
 */

describe("easeOutQuart easing function", () => {
  it("returns 0 at t=0", () => {
    expect(easeOutQuartValue(0)).toBe(0);
  });

  it("returns 1 at t=1", () => {
    expect(easeOutQuartValue(1)).toBe(1);
  });

  it("is monotonically increasing", () => {
    const samples = [0, 0.25, 0.5, 0.75, 1].map(easeOutQuartValue);
    for (let i = 1; i < samples.length; i++) {
      expect(samples[i]!).toBeGreaterThanOrEqual(samples[i - 1]!);
    }
  });

  it("is greater than linear at midpoint (easing out front-loads progress)", () => {
    expect(easeOutQuartValue(0.5)).toBeGreaterThan(0.5);
  });
});
