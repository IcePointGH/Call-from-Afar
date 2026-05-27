import { useEffect, useState } from "react";

interface PhoneBoothIllustrationProps {
  state?: "idle" | "connecting" | "connected";
  className?: string;
}

export const PhoneBoothIllustration = ({
  state = "idle",
  className = "",
}: PhoneBoothIllustrationProps) => {
  const [phoneOffset, setPhoneOffset] = useState(20);
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    if (state === "connecting") {
      const timeout = setTimeout(() => {
        setPhoneOffset(0);
      }, 200);
      return () => clearTimeout(timeout);
    } else if (state === "idle") {
      setPhoneOffset(20);
      setIsFloating(false);
    }
  }, [state]);

  useEffect(() => {
    if (state === "connected") {
      setIsFloating(true);
    }
  }, [state]);

  return (
    <div
      className={`relative w-64 h-96 md:w-72 md:h-[28rem] mx-auto ${className}`}
    >
      {/* 装饰星星 */}
      <div
        className={`absolute top-8 left-8 w-2 h-2 rounded-full bg-mist-white transition-opacity duration-500 ${
          state === "connected" ? "animate-glow-pulse" : "opacity-60"
        }`}
      />
      <div
        className={`absolute top-16 right-12 w-1.5 h-1.5 rounded-full bg-mist-white transition-opacity duration-500 ${
          state === "connected" ? "animate-glow-pulse" : "opacity-40"
        }`}
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className={`absolute top-32 left-16 w-1 h-1 rounded-full bg-moonlight transition-opacity duration-500 ${
          state === "connected" ? "animate-glow-pulse" : "opacity-30"
        }`}
        style={{ animationDelay: "1s" }}
      />

      {/* 月牙 */}
      <svg
        className="absolute top-6 right-8 w-8 h-8"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16C8 11.5817 11.5817 8 16 8C17.369 8 18.6635 8.30298 19.8259 8.82957C18.8023 10.1815 18.2 11.9949 18.2 14C18.2 18.4183 21.5817 22 26 22C22.4183 22 19.2 18.4183 19.2 14C19.2 11.5817 20.1169 9.45152 21.5643 8L24 16Z"
          fill="#e8dcc4"
        />
      </svg>

      {/* 电话亭 */}
      <svg
        viewBox="0 0 200 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${isFloating ? "animate-phone-float" : ""}`}
      >
        {/* 亭顶 - 梯形 */}
        <path d="M30 80 L50 30 L150 30 L170 80 Z" fill="#5a6db8" />

        {/* 亭身 - 圆角矩形 */}
        <rect x="30" y="80" width="140" height="200" rx="8" fill="#6b7fd7" />

        {/* 内部阴影区域 */}
        <rect
          x="45"
          y="95"
          width="110"
          height="170"
          rx="4"
          fill="#4a5a8a"
        />

        {/* 电话听筒 */}
        <g
          style={{
            transform: `translateY(${phoneOffset}px)`,
            transition: "transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        >
          <rect
            x="70"
            y="150"
            width="60"
            height="25"
            rx="12"
            fill="#e8dcc4"
          />
          <circle cx="75" cy="162" r="12" fill="#e8dcc4" />
          <circle cx="125" cy="162" r="12" fill="#e8dcc4" />
        </g>

        {/* 底部渐变融入背景 */}
        <defs>
          <linearGradient
            id="boothGradient"
            x1="100"
            y1="280"
            x2="100"
            y2="320"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0a0e1a" stopOpacity="0" />
            <stop offset="1" stopColor="#0a0e1a" stopOpacity="1" />
          </linearGradient>
        </defs>
        <rect
          x="30"
          y="270"
          width="140"
          height="50"
          fill="url(#boothGradient)"
        />

        {/* 地面线条 */}
        <line
          x1="20"
          y1="285"
          x2="180"
          y2="285"
          stroke="#4a5a8a"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
