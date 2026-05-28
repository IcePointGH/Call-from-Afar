import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotionPreferences } from "../motion/preferences";
import { fadeInVariants, pageVariants } from "../motion/variants";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  const { allowTransition } = useMotionPreferences();

  return (
    <motion.div
      className={className}
      variants={pageVariants(allowTransition)}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const FadeIn = ({ children, delay = 0, className = "" }: FadeInProps) => {
  const { allowTransition } = useMotionPreferences();

  return (
    <motion.div
      className={className}
      variants={fadeInVariants(allowTransition, delay)}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};
