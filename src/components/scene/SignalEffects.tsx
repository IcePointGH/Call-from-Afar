import { motion, type Transition } from "framer-motion";
import { useMotionPreferences } from "../../motion/preferences";
import { motionDurations, motionEase } from "../../motion/tokens";

export type SignalStage = "idle" | "dialing" | "connected" | "ending";

interface SignalEffectsProps {
  stage: SignalStage;
  centerX?: number;
  centerY?: number;
}

const starLines = Array.from({ length: 8 }, (_, index) => {
  const angle = (index * Math.PI * 2) / 8;
  const innerRadius = 82;
  const outerRadius = index % 2 === 0 ? 108 : 98;

  return {
    id: `star-line-${index}`,
    x1: Math.cos(angle) * innerRadius,
    y1: Math.sin(angle) * innerRadius,
    x2: Math.cos(angle) * outerRadius,
    y2: Math.sin(angle) * outerRadius,
    delay: index * 0.045,
  };
});

const ringTransition = (delay: number): Transition => ({
  duration: 1.6,
  repeat: Infinity,
  ease: motionEase.softOut,
  delay,
});

export const SignalEffects = ({
  stage,
  centerX = 100,
  centerY = 170,
}: SignalEffectsProps) => {
  const { allowAnimation } = useMotionPreferences();

  if (stage === "idle") {
    return null;
  }

  return (
    <motion.svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 200 320"
      fill="none"
      aria-hidden="true"
      initial={false}
    >
      <g transform={`translate(${centerX} ${centerY})`}>
        {stage === "dialing" && (
          <>
            {[0, 1, 2].map((ring) => (
              <motion.circle
                key={ring}
                cx="0"
                cy="0"
                r="34"
                stroke="#e8dcc4"
                strokeWidth="2"
                initial={false}
                animate={
                  allowAnimation
                    ? { r: [34, 92], opacity: [0.58, 0] }
                    : { r: 72 + ring * 8, opacity: 0.22 }
                }
                transition={
                  allowAnimation
                    ? ringTransition(ring * 0.26)
                    : { duration: motionDurations.instant }
                }
              />
            ))}

            {starLines.map((line) => (
              <motion.line
                key={line.id}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="#f6efe0"
                strokeWidth="2"
                strokeLinecap="round"
                initial={false}
                animate={
                  allowAnimation
                    ? { opacity: [0.18, 0.78, 0.18], pathLength: [0.2, 1, 0.2] }
                    : { opacity: 0.36, pathLength: 1 }
                }
                transition={
                  allowAnimation
                    ? {
                        duration: 0.9,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: motionEase.standard,
                        delay: line.delay,
                      }
                    : { duration: motionDurations.instant }
                }
              />
            ))}
          </>
        )}

        {stage === "connected" && (
          <>
            <motion.circle
              cx="0"
              cy="0"
              r="88"
              fill="#e8dcc4"
              initial={false}
              animate={
                allowAnimation
                  ? { scale: [0.96, 1.03, 0.96], opacity: [0.06, 0.13, 0.06] }
                  : { scale: 1, opacity: 0.1 }
              }
              transition={
                allowAnimation
                  ? { duration: 3.2, repeat: Infinity, ease: motionEase.standard }
                  : { duration: motionDurations.instant }
              }
            />
            <motion.circle
              cx="0"
              cy="0"
              r="66"
              stroke="#e8dcc4"
              strokeWidth="2"
              initial={false}
              animate={
                allowAnimation
                  ? { scale: [0.98, 1.02, 0.98], opacity: [0.28, 0.48, 0.28] }
                  : { scale: 1, opacity: 0.34 }
              }
              transition={
                allowAnimation
                  ? { duration: 2.8, repeat: Infinity, ease: motionEase.standard }
                  : { duration: motionDurations.instant }
              }
            />
          </>
        )}

        {stage === "ending" && (
          <motion.circle
            cx="0"
            cy="0"
            r="86"
            stroke="#e8dcc4"
            strokeWidth="2"
            initial={false}
            animate={allowAnimation ? { r: 42, opacity: 0 } : { r: 58, opacity: 0.18 }}
            transition={
              allowAnimation
                ? { duration: motionDurations.slow, ease: motionEase.softOut }
                : { duration: motionDurations.instant }
            }
          />
        )}
      </g>
    </motion.svg>
  );
};
