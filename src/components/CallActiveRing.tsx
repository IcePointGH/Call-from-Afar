import { useEffect, useState } from "react";

interface CallActiveRingProps {
  isActive: boolean;
}

export const CallActiveRing = ({ isActive }: CallActiveRingProps) => {
  const [rings, setRings] = useState<{ id: number; delay: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const ringData = [
        { id: 0, delay: 0 },
        { id: 1, delay: 400 },
        { id: 2, delay: 800 },
      ];
      setRings(ringData);

      const interval = setInterval(() => {
        setRings((prev) =>
          prev.map((r) => ({ ...r, delay: r.delay > 0 ? r.delay - 400 : 0 }))
        );
      }, 800);

      return () => clearInterval(interval);
    } else {
      setRings([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {rings.map((ring) => (
        <div
          key={ring.id}
          className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-accent/40 animate-ping"
          style={{
            animationDuration: "2s",
            opacity: ring.delay === 0 ? 0.6 : 0,
          }}
        />
      ))}
    </div>
  );
};
