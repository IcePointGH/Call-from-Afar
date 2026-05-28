import { motion } from "framer-motion";
import { useMotionPreferences } from "../../motion/preferences";
import { motionDurations, motionEase, motionSprings } from "../../motion/tokens";
import { SignalEffects, type SignalStage } from "./SignalEffects";

export type PhoneBoothStageName = SignalStage;

interface PhoneBoothStageProps {
  stage: PhoneBoothStageName;
  className?: string;
}

const receiverY: Record<PhoneBoothStageName, number> = {
  idle: 20,
  dialing: 6,
  connected: 0,
  ending: 14,
};

const lampOpacity: Record<PhoneBoothStageName, number> = {
  idle: 0.42,
  dialing: 0.72,
  connected: 0.9,
  ending: 0.28,
};

export const PhoneBoothStage = ({
  stage,
  className = "",
}: PhoneBoothStageProps) => {
  const { allowAnimation } = useMotionPreferences();
  const active = stage === "dialing" || stage === "connected";

  return (
    <div className={`relative mx-auto h-96 w-64 md:h-[28rem] md:w-72 ${className}`}>
      <SignalEffects stage={stage} />

      <motion.svg
        viewBox="0 0 200 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative h-full w-full"
        initial={false}
        animate={
          allowAnimation && stage === "connected"
            ? { y: [-2, 3, -2], scale: [1, 1.012, 1] }
            : { y: stage === "dialing" ? 2 : 0, scale: stage === "dialing" ? 0.992 : 1 }
        }
        transition={
          allowAnimation && stage === "connected"
            ? { duration: 3.4, repeat: Infinity, ease: motionEase.standard }
            : allowAnimation
              ? motionSprings.tactile
              : { duration: motionDurations.instant }
        }
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="phoneBoothStageBaseFade"
            x1="100"
            y1="280"
            x2="100"
            y2="320"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0a0e1a" stopOpacity="0" />
            <stop offset="1" stopColor="#0a0e1a" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="phoneBoothStageLampGlow" cx="0" cy="0" r="1">
            <stop stopColor="#f6efe0" stopOpacity="0.78" />
            <stop offset="1" stopColor="#f6efe0" stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.circle
          cx="100"
          cy="72"
          r="58"
          fill="url(#phoneBoothStageLampGlow)"
          initial={false}
          animate={{
            opacity: allowAnimation && active ? [0.16, 0.34, 0.16] : lampOpacity[stage] * 0.24,
            scale: allowAnimation && active ? [0.92, 1.08, 0.92] : 1,
          }}
          transition={
            allowAnimation && active
              ? { duration: 2.4, repeat: Infinity, ease: motionEase.standard }
              : { duration: motionDurations.instant }
          }
        />

        <motion.g
          initial={false}
          animate={{
            y: stage === "dialing" ? 3 : 0,
            filter: `brightness(${stage === "ending" ? 0.86 : active ? 1.08 : 1})`,
          }}
          transition={allowAnimation ? motionSprings.tactile : { duration: motionDurations.instant }}
        >
          <path d="M30 80 L50 30 L150 30 L170 80 Z" fill="#5a6db8" />
          <rect x="30" y="80" width="140" height="200" rx="8" fill="#6b7fd7" />
          <rect x="45" y="95" width="110" height="170" rx="4" fill="#4a5a8a" />

          <motion.rect
            x="58"
            y="44"
            width="84"
            height="18"
            rx="9"
            fill="#e8dcc4"
            initial={false}
            animate={{ opacity: lampOpacity[stage] }}
            transition={allowAnimation ? motionSprings.tactile : { duration: motionDurations.instant }}
          />

          <motion.g
            initial={false}
            animate={{
              y: receiverY[stage],
              rotate: stage === "dialing" ? -2 : stage === "ending" ? 1 : 0,
            }}
            style={{ originX: "100px", originY: "162px" }}
            transition={allowAnimation ? motionSprings.tactile : { duration: motionDurations.instant }}
          >
            <rect x="70" y="150" width="60" height="25" rx="12" fill="#e8dcc4" />
            <circle cx="75" cy="162" r="12" fill="#e8dcc4" />
            <circle cx="125" cy="162" r="12" fill="#e8dcc4" />
          </motion.g>

          <rect x="30" y="270" width="140" height="50" fill="url(#phoneBoothStageBaseFade)" />
          <line
            x1="20"
            y1="285"
            x2="180"
            y2="285"
            stroke="#4a5a8a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.svg>
    </div>
  );
};
