import { useState, useEffect } from "react";

interface LoadingOverlayProps {
  text?: string;
  duration?: number;
  onComplete?: () => void;
}

export const LoadingOverlay = ({
  text = "每个人心里，都有一个好久不见的人，和一段没说完的话",
  duration = 2000,
  onComplete,
}: LoadingOverlayProps) => {
  const [chars, setChars] = useState<{ char: string; delay: number; visible: boolean }[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const charArray = text.split("").map((char, index) => ({
      char,
      delay: index * 60,
      visible: false,
    }));
    setChars(charArray);

    const timers: NodeJS.Timeout[] = [];

    charArray.forEach((item) => {
      const timer = setTimeout(() => {
        setChars((prev) =>
          prev.map((c, i) => (i === charArray.indexOf(item) ? { ...c, visible: true } : c))
        );
      }, item.delay);
      timers.push(timer);
    });

    const completeTimer = setTimeout(() => {
      setIsComplete(true);
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    }, duration);

    timers.push(completeTimer);

    return () => timers.forEach(clearTimeout);
  }, [text, duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-space transition-opacity duration-500 ${
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <h1 className="text-center text-xl md:text-2xl px-8 max-w-2xl leading-relaxed">
        {chars.map((item, index) => (
          <span
            key={index}
            className={`char ${item.visible ? "animate-char-fade-in" : "opacity-0"}`}
            style={item.visible ? { animationDelay: "0ms" } : {}}
          >
            {item.char === " " ? "\u00A0" : item.char}
          </span>
        ))}
      </h1>
    </div>
  );
};
