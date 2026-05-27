import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { useAppStore } from "../store/useAppStore";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  const { transitionEnabled } = useAppStore();

  const variants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: transitionEnabled ? 0.4 : 0,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: transitionEnabled ? 0.3 : 0,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
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
  const { transitionEnabled } = useAppStore();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: transitionEnabled ? 0.4 : 0,
          delay: transitionEnabled ? delay : 0,
          ease: [0.25, 0.1, 0.25, 1] as const,
        },
      }}
    >
      {children}
    </motion.div>
  );
};
