export const motionDurations = {
  instant: 0,
  fast: 0.18,
  base: 0.32,
  slow: 0.56,
  ritual: 0.9,
} as const;

export const motionDelays = {
  none: 0,
  short: 0.08,
  medium: 0.16,
  long: 0.28,
} as const;

export const motionEase = {
  standard: [0.25, 0.1, 0.25, 1] as const,
  softOut: [0.16, 1, 0.3, 1] as const,
  press: [0.2, 0, 0, 1] as const,
} as const;

export const motionSprings = {
  tactile: {
    type: "spring",
    stiffness: 420,
    damping: 28,
    mass: 0.8,
  },
  gentle: {
    type: "spring",
    stiffness: 180,
    damping: 24,
    mass: 1,
  },
} as const;
