/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        "deep-space": "#0a0e1a",
        "mist-white": "#f5f5f7",
        moonlight: "#e8dcc4",
        accent: "#6b7fd7",
        "accent-dark": "#5a6db8",
        "booth-shadow": "#4a5a8a",
      },
      fontFamily: {
        serif: ["ZCOOL XiaoWei", "Noto Serif SC", "serif"],
        sans: ["Noto Sans SC", "sans-serif"],
        display: ["Cormorant Garamond", "serif"],
      },
      animation: {
        "char-fade-in": "charFadeIn 400ms ease-out forwards",
        "phone-float": "phoneFloat 800ms ease-in-out infinite",
        "star-connect": "starConnect 600ms ease-out forwards",
        "fade-in": "fadeIn 300ms ease-out forwards",
        "modal-slide-in": "modalSlideIn 300ms ease-out forwards",
        "ticket-reveal": "ticketReveal 600ms ease-out forwards",
        "pulse-scale": "pulseScale 200ms ease-out forwards",
        "ripple-expand": "rippleExpand 1.5s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        charFadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        phoneFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        starConnect: {
          to: { strokeDashoffset: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        modalSlideIn: {
          from: { opacity: "0", transform: "scale(0.9) translateY(20px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        ticketReveal: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseScale: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.05)" },
        },
        rippleExpand: {
          from: { transform: "scale(0.5)", opacity: "1" },
          to: { transform: "scale(2)", opacity: "0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};
