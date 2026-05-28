import { Children, ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotionPreferences } from "../../motion/preferences";
import { revealContainerVariants, revealItemVariants } from "../../motion/variants";

interface TicketRevealProps {
  children: ReactNode;
}

export const TicketReveal = ({ children }: TicketRevealProps) => {
  const { allowTransition } = useMotionPreferences();

  return (
    <motion.div
      className="w-full flex flex-col items-center"
      variants={revealContainerVariants(allowTransition)}
      initial="initial"
      animate="animate"
    >
      {Children.map(children, (child) => (
        <motion.div variants={revealItemVariants(allowTransition)}>{child}</motion.div>
      ))}
    </motion.div>
  );
};
