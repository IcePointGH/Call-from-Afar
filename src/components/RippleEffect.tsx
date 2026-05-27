import { useEffect, useState } from "react";

interface RippleEffectProps {
  isActive: boolean;
  centerX?: number;
  centerY?: number;
}

export const RippleEffect = ({
  isActive,
  centerX = 100,
  centerY = 160,
}: RippleEffectProps) => {
  const [ripples, setRipples] = useState<{ id: number; delay: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const rippleData = [
        { id: 0, delay: 0 },
        { id: 1, delay: 150 },
        { id: 2, delay: 300 },
      ];
      setRipples(rippleData);
    } else {
      setRipples([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 200 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {ripples.map((ripple) => (
        <circle
          key={ripple.id}
          cx={centerX}
          cy={centerY}
          r="30"
          fill="none"
          stroke="#6b7fd7"
          strokeWidth="2"
          className="animate-ripple-expand"
          style={{
            animationDelay: `${ripple.delay}ms`,
            transformOrigin: `${centerX}px ${centerY}px`,
          }}
        />
      ))}
    </svg>
  );
};
