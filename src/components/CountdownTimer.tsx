import { useEffect, useState } from "react";

interface CountdownTimerProps {
  duration: number;
  isActive: boolean;
}

export const CountdownTimer = ({ duration, isActive }: CountdownTimerProps) => {
  const [pulse, setPulse] = useState(false);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isActive && duration > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 200);
      return () => clearTimeout(timer);
    }
  }, [duration, isActive]);

  return (
    <div
      className={`text-4xl md:text-5xl font-light tracking-wider transition-transform duration-200 ${
        pulse ? "scale-105" : "scale-100"
      }`}
    >
      {formatTime(duration)}
    </div>
  );
};
