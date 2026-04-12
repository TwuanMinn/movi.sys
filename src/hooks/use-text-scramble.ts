"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

export function useTextScramble(text: string, speed = 40, enabled = true) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const iterationRef = useRef(0);

  const scramble = useCallback(() => {
    iterationRef.current = 0;

    intervalRef.current = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iterationRef.current) return text[i]!;
            return CHARS[Math.floor(Math.random() * CHARS.length)]!;
          })
          .join("")
      );

      iterationRef.current += 1 / 3;

      if (iterationRef.current >= text.length) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, speed);
  }, [text, speed]);

  useEffect(() => {
    if (enabled) scramble();
    return () => clearInterval(intervalRef.current);
  }, [scramble, enabled]);

  return display;
}
