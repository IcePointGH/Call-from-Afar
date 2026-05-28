import { ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { useMotionPreferences } from "../motion/preferences";
import { motionSprings } from "../motion/tokens";

type TouchableButtonVariant = "primary" | "secondary" | "ghost";

interface TouchableButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: TouchableButtonVariant;
  fullWidth?: boolean;
}

const variantClassNames: Record<TouchableButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "py-3 text-mist-white/50 hover:text-mist-white/70 transition-colors text-sm",
};

export const TouchableButton = ({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: TouchableButtonProps) => {
  const { allowAnimation } = useMotionPreferences();
  const classNames = [
    variantClassNames[variant],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      {...props}
      disabled={disabled}
      className={classNames}
      whileHover={!disabled && allowAnimation ? { y: -2, scale: 1.02 } : undefined}
      whileTap={!disabled && allowAnimation ? { y: 2, scale: 0.97 } : undefined}
      transition={allowAnimation ? motionSprings.tactile : { duration: 0 }}
    >
      {children}
    </motion.button>
  );
};
