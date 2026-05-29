import { Children, ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotionPreferences } from "../../motion/preferences";
import { motionDelays, motionDurations, motionEase } from "../../motion/tokens";

interface TicketRevealProps {
  children: ReactNode;
}

export const TicketReveal = ({ children }: TicketRevealProps) => {
  const { allowAnimation, allowTransition } = useMotionPreferences();
  const shouldMove = allowAnimation && allowTransition;
  const items = Children.toArray(children);

  return (
    <motion.div
      className="flex w-full flex-col items-center"
      initial={false}
      animate="ready"
    >
      {items.map((child, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0,
            y: shouldMove ? (index === 1 ? 22 : 12) : 0,
            scale: shouldMove && index === 1 ? 0.97 : 1,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: shouldMove
              ? [motionDelays.short, motionDelays.medium, motionDurations.slow][index] ??
                motionDelays.long
              : 0,
            duration: shouldMove ? motionDurations.base : motionDurations.instant,
            ease: motionEase.softOut,
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};
