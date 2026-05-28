import type { Variants } from "framer-motion";
import { motionDelays, motionDurations, motionEase, motionSprings } from "./tokens";

export const pageVariants = (enabled: boolean): Variants => ({
  initial: { opacity: 0, y: enabled ? 18 : 0 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: enabled ? motionDurations.base : 0,
      ease: motionEase.standard,
    },
  },
  exit: {
    opacity: 0,
    y: enabled ? -10 : 0,
    transition: {
      duration: enabled ? motionDurations.fast : 0,
      ease: motionEase.standard,
    },
  },
});

export const fadeInVariants = (enabled: boolean, delay = 0): Variants => ({
  initial: { opacity: 0, y: enabled ? 10 : 0 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: enabled ? motionDurations.base : 0,
      delay: enabled ? delay : 0,
      ease: motionEase.standard,
    },
  },
});

export const modalVariants = (enabled: boolean): Variants => ({
  initial: { opacity: 0, scale: enabled ? 0.96 : 1, y: enabled ? 16 : 0 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: enabled ? motionSprings.gentle : { duration: 0 },
  },
});

export const revealContainerVariants = (enabled: boolean): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: enabled ? motionDelays.medium : 0,
      delayChildren: enabled ? motionDelays.short : 0,
    },
  },
});

export const revealItemVariants = (enabled: boolean): Variants => ({
  initial: { opacity: 0, y: enabled ? 12 : 0, scale: enabled ? 0.98 : 1 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: enabled ? motionSprings.gentle : { duration: 0 },
  },
});
