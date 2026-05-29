import { motion } from "framer-motion";
import { useMotionPreferences } from "../../motion/preferences";
import { motionDurations, motionEase, motionSprings } from "../../motion/tokens";
import { SignalEffects, type SignalStage } from "./SignalEffects";

export type PhoneBoothStageName = SignalStage | "inside";

interface PhoneBoothStageProps {
  stage: PhoneBoothStageName;
  className?: string;
}

const receiverY: Record<PhoneBoothStageName, number> = {
  idle: 18,
  inside: 18,
  dialing: 5,
  connected: 0,
  ending: 12,
};

const lampOpacity: Record<PhoneBoothStageName, number> = {
  idle: 0.42,
  inside: 0.58,
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
  const isInside = stage !== "idle";
  const isDialing = stage === "dialing";
  const isEnding = stage === "ending";
  const signalStage: SignalStage = stage === "inside" ? "idle" : stage;

  return (
    <div className={`relative mx-auto h-96 w-64 md:h-[28rem] md:w-72 ${className}`}>
      <SignalEffects stage={signalStage} />

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
          <linearGradient
            id="phoneBoothGlass"
            x1="64"
            y1="102"
            x2="142"
            y2="244"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#d7e1ff" stopOpacity="0.34" />
            <stop offset="1" stopColor="#202a4b" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="phoneBoothStageLampGlow" cx="0" cy="0" r="1">
            <stop stopColor="#f6efe0" stopOpacity="0.78" />
            <stop offset="1" stopColor="#f6efe0" stopOpacity="0" />
          </radialGradient>
          <filter id="phoneBoothSoftShadow" x="0" y="0" width="200" height="320">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#02040a" floodOpacity="0.34" />
          </filter>
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
            y: isDialing ? 3 : 0,
            filter: `brightness(${isEnding ? 0.86 : active || stage === "inside" ? 1.05 : 1})`,
          }}
          transition={allowAnimation ? motionSprings.tactile : { duration: motionDurations.instant }}
          filter="url(#phoneBoothSoftShadow)"
        >
          <ellipse cx="100" cy="292" rx="78" ry="10" fill="#02040a" opacity="0.38" />

          <path d="M32 80 L50 30 H150 L168 80 Z" fill="#4f63bd" />
          <path d="M43 70 L56 42 H144 L157 70 Z" fill="#28345f" opacity="0.55" />
          <motion.rect
            x="60"
            y="43"
            width="80"
            height="20"
            rx="6"
            fill="#e8dcc4"
            initial={false}
            animate={{
              opacity: lampOpacity[stage],
              filter: active ? "drop-shadow(0 0 8px rgba(232,220,196,0.55))" : "none",
            }}
            transition={allowAnimation ? motionSprings.tactile : { duration: motionDurations.instant }}
          />
          <text
            x="100"
            y="58"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="#1d2648"
            letterSpacing="1"
          >
            时空电话
          </text>

          <rect x="28" y="78" width="144" height="204" rx="11" fill="#6b7fd7" />
          <rect x="36" y="88" width="128" height="184" rx="7" fill="#4f63bd" opacity="0.75" />

          <motion.rect
            x="48"
            y="98"
            width="104"
            height="166"
            rx="5"
            fill={isInside ? "#151c35" : "#2f3b68"}
            initial={false}
            animate={{ opacity: isInside ? 0.92 : 1 }}
            transition={allowAnimation ? motionSprings.gentle : { duration: motionDurations.instant }}
          />
          <motion.rect
            x="57"
            y="108"
            width="86"
            height="52"
            rx="4"
            fill="url(#phoneBoothGlass)"
            initial={false}
            animate={{ opacity: isInside ? 0.18 : 1 }}
            transition={allowAnimation ? motionSprings.gentle : { duration: motionDurations.instant }}
          />
          <motion.rect
            x="57"
            y="169"
            width="86"
            height="84"
            rx="4"
            fill="url(#phoneBoothGlass)"
            initial={false}
            animate={{ opacity: isInside ? 0.16 : 1 }}
            transition={allowAnimation ? motionSprings.gentle : { duration: motionDurations.instant }}
          />

          <motion.g
            initial={false}
            animate={{
              opacity: isInside ? 0.22 : 1,
              x: isInside ? [-5, 0] : 0,
            }}
            transition={allowAnimation ? motionSprings.gentle : { duration: motionDurations.instant }}
          >
            <line x1="100" y1="98" x2="100" y2="264" stroke="#6b7fd7" strokeWidth="4" />
            <line x1="48" y1="164" x2="152" y2="164" stroke="#6b7fd7" strokeWidth="4" />
            <line x1="48" y1="204" x2="152" y2="204" stroke="#6b7fd7" strokeWidth="3" opacity="0.75" />
          </motion.g>

          <path
            d="M70 118 L92 106"
            stroke="#f5f5f7"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.42"
          />
          <path
            d="M108 176 L137 157"
            stroke="#f5f5f7"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.28"
          />

          <motion.g
            initial={false}
            animate={{
              opacity: isInside ? 1 : 0,
              scale: isInside ? 1 : 0.92,
            }}
            transition={allowAnimation ? motionSprings.gentle : { duration: motionDurations.instant }}
          >
            <rect x="60" y="112" width="80" height="114" rx="12" fill="#0d142a" />
            <rect x="66" y="119" width="68" height="100" rx="8" fill="#121d3a" />
            <rect x="72" y="137" width="56" height="14" rx="4" fill="#e8dcc4" opacity="0.84" />
            <rect x="78" y="156" width="44" height="7" rx="3.5" fill="#6b7fd7" opacity="0.95" />
            <rect x="82" y="130" width="36" height="3" rx="1.5" fill="#f5f5f7" opacity="0.2" />

            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <motion.circle
                  key={`key-${row}-${col}`}
                  cx={84 + col * 16}
                  cy={172 + row * 13}
                  r="3.4"
                  fill="#f5f5f7"
                  opacity={isDialing ? 0.82 : 0.48}
                  animate={
                    allowAnimation && isDialing
                      ? { opacity: [0.36, 0.9, 0.36], scale: [1, 1.12, 1] }
                      : { opacity: isDialing ? 0.82 : 0.48, scale: 1 }
                  }
                  transition={{
                    duration: allowAnimation && isDialing ? 0.8 : motionDurations.instant,
                    delay: (row * 3 + col) * 0.05,
                    repeat: allowAnimation && isDialing ? Infinity : 0,
                    ease: motionEase.standard,
                  }}
                />
              ))
            )}

            <motion.g
              initial={false}
              animate={{
                y: receiverY[stage],
                x: isDialing ? -1 : 0,
                rotate: isDialing ? -5 : isEnding ? 3 : 0,
              }}
              style={{ originX: "100px", originY: "122px" }}
              transition={allowAnimation ? motionSprings.tactile : { duration: motionDurations.instant }}
            >
              <rect x="73" y="115" width="54" height="15" rx="7.5" fill="#e8dcc4" />
              <circle cx="75" cy="122.5" r="8.5" fill="#e8dcc4" />
              <circle cx="125" cy="122.5" r="8.5" fill="#e8dcc4" />
              <rect x="84" y="120" width="32" height="5" rx="2.5" fill="#f5f5f7" opacity="0.24" />
              <path
                d="M120 130 C128 138 133 151 130 166 C127 178 116 182 108 175"
                stroke="#e8dcc4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="1 6"
                opacity="0.68"
                fill="none"
              />
            </motion.g>

            <path
              d="M86 231 C92 239 108 239 114 231"
              stroke="#e8dcc4"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.74"
            />
            <rect x="86" y="205" width="28" height="6" rx="3" fill="#e8dcc4" opacity="0.45" />
          </motion.g>

          {!isInside && (
            <>
              <circle cx="130" cy="194" r="3" fill="#e8dcc4" opacity="0.76" />
              <path
                d="M128 190 C134 190 137 194 137 200"
                stroke="#e8dcc4"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.5"
                fill="none"
              />
            </>
          )}

          <rect x="34" y="78" width="8" height="204" rx="4" fill="#4355a7" opacity="0.9" />
          <rect x="158" y="78" width="8" height="204" rx="4" fill="#4355a7" opacity="0.9" />
          <rect x="28" y="272" width="144" height="12" rx="6" fill="#4f63bd" />
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
