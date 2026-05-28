import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";

export interface MotionPreferences {
  allowAnimation: boolean;
  allowTransition: boolean;
  prefersReducedMotion: boolean;
}

export const useMotionPreferences = (): MotionPreferences => {
  const { animationEnabled, transitionEnabled } = useAppStore();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return {
    allowAnimation: animationEnabled && !prefersReducedMotion,
    allowTransition: transitionEnabled && !prefersReducedMotion,
    prefersReducedMotion,
  };
};

export const durationOrZero = (enabled: boolean, duration: number) =>
  enabled ? duration : 0;
