import { useEffect, useRef, useCallback } from "react";

export const useTimer = (callback: () => void, interval: number = 1000) => {
  const savedCallback = useRef(callback);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const start = useCallback(() => {
    if (timerRef.current !== null) return;
    timerRef.current = window.setInterval(() => {
      savedCallback.current();
    }, interval);
  }, [interval]);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return { start, stop };
};
