import { useEffect, useState } from "react";

interface StarLineEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const StarLineEffect = ({ isActive, onComplete }: StarLineEffectProps) => {
  const [lines, setLines] = useState<{ id: number; delay: number; visible: boolean }[]>([]);

  useEffect(() => {
    if (isActive) {
      const lineData = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        delay: i * 100,
        visible: false,
      }));
      setLines(lineData);

      lineData.forEach((line) => {
        setTimeout(() => {
          setLines((prev) =>
            prev.map((l) => (l.id === line.id ? { ...l, visible: true } : l))
          );
        }, line.delay);
      });

      const completeTimeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);

      return () => clearTimeout(completeTimeout);
    } else {
      setLines([]);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const centerX = 100;
  const centerY = 160;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 200 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {lines.map((line) => {
        if (!line.visible) return null;
        const angle = (line.id / 8) * Math.PI * 2 - Math.PI / 2;
        const length = 60;
        const endX = centerX + Math.cos(angle) * length;
        const endY = centerY + Math.sin(angle) * length;

        return (
          <line
            key={line.id}
            x1={centerX}
            y1={centerY}
            x2={endX}
            y2={endY}
            stroke="#f5f5f7"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-star-connect"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: 0,
              animation: `starConnect 600ms ease-out forwards`,
            }}
          />
        );
      })}
    </svg>
  );
};
