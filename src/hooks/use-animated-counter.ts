"use client";

import { useEffect, useRef, useState } from "react";

/**
 * @performance-optimizer: requestAnimationFrame-based counter
 * for smooth number animations without layout thrashing.
 * Uses easeOutQuart for natural deceleration.
 *
 * Uses a ref for the animation callback to avoid React Compiler
 * immutability violations from self-referencing useCallback.
 */

export function easeOutQuartValue(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function useAnimatedCounter(
  target: number,
  duration = 1500,
  enabled = true
) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    startTimeRef.current = 0;

    function step(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuartValue(progress);

      setValue(Math.round(target * easedProgress));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, enabled]);

  return value;
}
