# Motion Experience Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tactile, medium-interaction animation experience for the time-space phone booth flow while keeping the app calm, accessible, and maintainable.

**Architecture:** Add a shared `src/motion/` layer for timing, variants, and motion preferences. Refactor call-scene effects into `src/components/scene/`, then update pages and ticket components to consume those primitives instead of scattering animation details.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, html2canvas.

---

## File Structure

Create:

- `src/motion/tokens.ts`: shared durations, delays, easing curves, and spring settings.
- `src/motion/preferences.ts`: app/system motion preference hook and helpers.
- `src/motion/variants.ts`: shared Framer Motion variants for pages, buttons, modals, and reveal groups.
- `src/components/TouchableButton.tsx`: shared tactile button component.
- `src/components/scene/SignalEffects.tsx`: stage-driven signal rings, star lines, and connected glow.
- `src/components/scene/PhoneBoothStage.tsx`: tactile phone booth object plus signal layer.
- `src/components/ticket/TicketActions.tsx`: save, print, and share controls.
- `src/components/ticket/TicketReveal.tsx`: staged ticket reveal wrapper.

Modify:

- `src/components/PageTransition.tsx`: use shared motion variants and preferences.
- `src/pages/HomePage.tsx`: use `TouchableButton`.
- `src/pages/EntryPage.tsx`: use `TouchableButton` and keep form behavior unchanged.
- `src/pages/CallPage.tsx`: replace scattered booth/effect components with `PhoneBoothStage` and a clearer stage flow.
- `src/pages/TicketPage.tsx`: use `TicketReveal`.
- `src/components/TicketCard.tsx`: keep exportable ticket DOM stable and move action controls to `TicketActions`.
- `src/index.css`: add reduced-motion CSS fallbacks and remove obsolete animation assumptions only after component migration.

Do not modify `package-lock.json` unless dependency installation is intentionally run during implementation.

---

### Task 1: Add Shared Motion Foundation

**Files:**
- Create: `src/motion/tokens.ts`
- Create: `src/motion/preferences.ts`
- Create: `src/motion/variants.ts`
- Modify: `src/components/PageTransition.tsx`

- [ ] **Step 1: Create motion tokens**

Create `src/motion/tokens.ts`:

```ts
export const motionDurations = {
  instant: 0,
  fast: 0.18,
  base: 0.32,
  slow: 0.56,
  ritual: 0.9,
} as const;

export const motionDelays = {
  none: 0,
  short: 0.08,
  medium: 0.16,
  long: 0.28,
} as const;

export const motionEase = {
  standard: [0.25, 0.1, 0.25, 1] as const,
  softOut: [0.16, 1, 0.3, 1] as const,
  press: [0.2, 0, 0, 1] as const,
} as const;

export const motionSprings = {
  tactile: {
    type: "spring",
    stiffness: 420,
    damping: 28,
    mass: 0.8,
  },
  gentle: {
    type: "spring",
    stiffness: 180,
    damping: 24,
    mass: 1,
  },
} as const;
```

- [ ] **Step 2: Create motion preference hook**

Create `src/motion/preferences.ts`:

```ts
import { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";

export interface MotionPreferences {
  allowAnimation: boolean;
  allowTransition: boolean;
  prefersReducedMotion: boolean;
}

export const useMotionPreferences = (): MotionPreferences => {
  const { animationEnabled, transitionEnabled } = useAppStore();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return {
    allowAnimation: animationEnabled && !prefersReducedMotion,
    allowTransition: transitionEnabled && !prefersReducedMotion,
    prefersReducedMotion,
  };
};

export const durationOrZero = (enabled: boolean, duration: number) =>
  enabled ? duration : 0;
```

- [ ] **Step 3: Create shared variants**

Create `src/motion/variants.ts`:

```ts
import { Variants } from "framer-motion";
import { motionDelays, motionDurations, motionEase, motionSprings } from "./tokens";

export const pageVariants = (enabled: boolean): Variants => ({
  initial: { opacity: 0, y: enabled ? 18 : 0 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: enabled ? motionDurations.base : 0,
      ease: motionEase.standard,
    },
  },
  exit: {
    opacity: 0,
    y: enabled ? -10 : 0,
    transition: {
      duration: enabled ? motionDurations.fast : 0,
      ease: motionEase.standard,
    },
  },
});

export const fadeInVariants = (enabled: boolean, delay = 0): Variants => ({
  initial: { opacity: 0, y: enabled ? 10 : 0 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: enabled ? motionDurations.base : 0,
      delay: enabled ? delay : 0,
      ease: motionEase.standard,
    },
  },
});

export const modalVariants = (enabled: boolean): Variants => ({
  initial: { opacity: 0, scale: enabled ? 0.96 : 1, y: enabled ? 16 : 0 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: enabled ? motionSprings.gentle : { duration: 0 },
  },
});

export const revealContainerVariants = (enabled: boolean): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: enabled ? motionDelays.medium : 0,
      delayChildren: enabled ? motionDelays.short : 0,
    },
  },
});

export const revealItemVariants = (enabled: boolean): Variants => ({
  initial: { opacity: 0, y: enabled ? 12 : 0, scale: enabled ? 0.98 : 1 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: enabled ? motionSprings.gentle : { duration: 0 },
  },
});
```

- [ ] **Step 4: Update PageTransition to use shared preferences**

Replace `src/components/PageTransition.tsx` with:

```tsx
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
```

- [ ] **Step 5: Verify TypeScript**

Run:

```bash
npm run check
```

Expected: TypeScript completes without errors related to `src/motion/*` or `PageTransition`.

- [ ] **Step 6: Commit foundation**

```bash
git add src/motion/tokens.ts src/motion/preferences.ts src/motion/variants.ts src/components/PageTransition.tsx
git commit -m "feat: add shared motion foundation"
```

---

### Task 2: Add Tactile Button Component

**Files:**
- Create: `src/components/TouchableButton.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/EntryPage.tsx`

- [ ] **Step 1: Create TouchableButton**

Create `src/components/TouchableButton.tsx`:

```tsx
import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotionPreferences } from "../motion/preferences";
import { motionSprings } from "../motion/tokens";

type TouchableButtonVariant = "primary" | "secondary" | "ghost";

interface TouchableButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
```

- [ ] **Step 2: Update HomePage primary action**

In `src/pages/HomePage.tsx`, add:

```tsx
import { TouchableButton } from "../components/TouchableButton";
```

Replace:

```tsx
<button onClick={handleStart} className="btn-primary text-lg">开启时空通话</button>
```

With:

```tsx
<TouchableButton onClick={handleStart} className="text-lg">
  开启时空通话
</TouchableButton>
```

- [ ] **Step 3: Update EntryPage actions**

In `src/pages/EntryPage.tsx`, add:

```tsx
import { TouchableButton } from "../components/TouchableButton";
```

Replace the submit button with:

```tsx
<TouchableButton onClick={handleSubmit} disabled={!isValid} fullWidth>
  进入通话
</TouchableButton>
```

Replace the return button with:

```tsx
<TouchableButton
  onClick={() => navigate("/")}
  variant="ghost"
  fullWidth
>
  返回首页
</TouchableButton>
```

- [ ] **Step 4: Verify TypeScript**

Run:

```bash
npm run check
```

Expected: No TypeScript errors. `TouchableButton` accepts all current button props used by HomePage and EntryPage.

- [ ] **Step 5: Commit tactile button**

```bash
git add src/components/TouchableButton.tsx src/pages/HomePage.tsx src/pages/EntryPage.tsx
git commit -m "feat: add tactile button interactions"
```

---

### Task 3: Build Scene Components

**Files:**
- Create: `src/components/scene/SignalEffects.tsx`
- Create: `src/components/scene/PhoneBoothStage.tsx`

- [ ] **Step 1: Create SignalEffects**

Create `src/components/scene/SignalEffects.tsx`:

```tsx
import { motion } from "framer-motion";
import { useMotionPreferences } from "../../motion/preferences";

export type SignalStage = "idle" | "dialing" | "connected" | "ending";

interface SignalEffectsProps {
  stage: SignalStage;
  centerX?: number;
  centerY?: number;
}

const lineCount = 8;

export const SignalEffects = ({ stage, centerX = 100, centerY = 160 }: SignalEffectsProps) => {
  const { allowAnimation } = useMotionPreferences();
  const showDialing = stage === "dialing";
  const showConnected = stage === "connected";
  const showEnding = stage === "ending";

  if (stage === "idle") return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 200 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {(showDialing || showEnding) &&
        [0, 1, 2].map((index) => (
          <motion.circle
            key={`ring-${index}`}
            cx={centerX}
            cy={centerY}
            r="28"
            fill="none"
            stroke="#6b7fd7"
            strokeWidth="2"
            initial={{ scale: showEnding ? 1.8 : 0.55, opacity: 0.7 }}
            animate={{
              scale: allowAnimation ? (showEnding ? 0.65 : 1.85) : 1,
              opacity: showEnding ? 0 : 0,
            }}
            transition={{
              duration: allowAnimation ? 0.9 : 0,
              delay: allowAnimation ? index * 0.12 : 0,
              ease: "easeOut",
            }}
            style={{ transformOrigin: `${centerX}px ${centerY}px` }}
          />
        ))}

      {showDialing &&
        Array.from({ length: lineCount }, (_, index) => {
          const angle = (index / lineCount) * Math.PI * 2 - Math.PI / 2;
          const length = 68;
          const endX = centerX + Math.cos(angle) * length;
          const endY = centerY + Math.sin(angle) * length;

          return (
            <motion.line
              key={`line-${index}`}
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke="#f5f5f7"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: allowAnimation ? 1 : 0.5, opacity: 0.75 }}
              transition={{
                duration: allowAnimation ? 0.5 : 0,
                delay: allowAnimation ? index * 0.06 : 0,
                ease: "easeOut",
              }}
            />
          );
        })}

      {showConnected && (
        <motion.circle
          cx={centerX}
          cy={centerY}
          r="76"
          fill="none"
          stroke="#e8dcc4"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: allowAnimation ? [0.25, 0.5, 0.25] : 0.35,
            scale: allowAnimation ? [0.98, 1.04, 0.98] : 1,
          }}
          transition={{
            duration: allowAnimation ? 2.6 : 0,
            repeat: allowAnimation ? Infinity : 0,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${centerX}px ${centerY}px` }}
        />
      )}
    </svg>
  );
};
```

- [ ] **Step 2: Create PhoneBoothStage**

Create `src/components/scene/PhoneBoothStage.tsx`:

```tsx
import { motion } from "framer-motion";
import { useMotionPreferences } from "../../motion/preferences";
import { motionSprings } from "../../motion/tokens";
import { SignalEffects, SignalStage } from "./SignalEffects";

export type PhoneBoothStageName = SignalStage;

interface PhoneBoothStageProps {
  stage: PhoneBoothStageName;
  className?: string;
}

const receiverYByStage: Record<PhoneBoothStageName, number> = {
  idle: 20,
  dialing: 8,
  connected: 0,
  ending: 14,
};

export const PhoneBoothStage = ({ stage, className = "" }: PhoneBoothStageProps) => {
  const { allowAnimation } = useMotionPreferences();
  const isAwake = stage === "dialing" || stage === "connected";

  return (
    <div className={`relative w-64 h-96 md:w-72 md:h-[28rem] mx-auto ${className}`}>
      <SignalEffects stage={stage} />

      <motion.div
        className="absolute inset-0"
        animate={
          allowAnimation
            ? {
                y: stage === "connected" ? [0, -3, 0] : 0,
                scale: stage === "dialing" ? [1, 0.985, 1.015, 1] : 1,
              }
            : { y: 0, scale: 1 }
        }
        transition={
          stage === "connected"
            ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            : motionSprings.tactile
        }
      >
        <svg
          viewBox="0 0 200 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <motion.path
            d="M30 80 L50 30 L150 30 L170 80 Z"
            fill="#5a6db8"
            animate={{ filter: isAwake ? "drop-shadow(0 0 10px rgba(232,220,196,0.28))" : "none" }}
          />
          <motion.rect
            x="30"
            y="80"
            width="140"
            height="200"
            rx="8"
            fill="#6b7fd7"
            animate={{ filter: isAwake ? "drop-shadow(0 0 24px rgba(107,127,215,0.35))" : "none" }}
          />
          <rect x="45" y="95" width="110" height="170" rx="4" fill="#4a5a8a" />
          <motion.g
            animate={{ y: receiverYByStage[stage] }}
            transition={allowAnimation ? motionSprings.tactile : { duration: 0 }}
          >
            <rect x="70" y="150" width="60" height="25" rx="12" fill="#e8dcc4" />
            <circle cx="75" cy="162" r="12" fill="#e8dcc4" />
            <circle cx="125" cy="162" r="12" fill="#e8dcc4" />
          </motion.g>
          <defs>
            <linearGradient id="boothStageGradient" x1="100" y1="280" x2="100" y2="320" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0a0e1a" stopOpacity="0" />
              <stop offset="1" stopColor="#0a0e1a" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect x="30" y="270" width="140" height="50" fill="url(#boothStageGradient)" />
          <line x1="20" y1="285" x2="180" y2="285" stroke="#4a5a8a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
};
```

- [ ] **Step 3: Verify scene components**

Run:

```bash
npm run check
```

Expected: No TypeScript errors in `SignalEffects.tsx` or `PhoneBoothStage.tsx`.

- [ ] **Step 4: Commit scene components**

```bash
git add src/components/scene/SignalEffects.tsx src/components/scene/PhoneBoothStage.tsx
git commit -m "feat: add tactile phone booth scene"
```

---

### Task 4: Refactor CallPage Stage Flow

**Files:**
- Modify: `src/pages/CallPage.tsx`

- [ ] **Step 1: Replace scattered effect imports**

In `src/pages/CallPage.tsx`, remove:

```tsx
import { PhoneBoothIllustration } from "../components/PhoneBoothIllustration";
import { StarLineEffect } from "../components/StarLineEffect";
import { RippleEffect } from "../components/RippleEffect";
import { CallActiveRing } from "../components/CallActiveRing";
```

Add:

```tsx
import { PhoneBoothStage, PhoneBoothStageName } from "../components/scene/PhoneBoothStage";
import { TouchableButton } from "../components/TouchableButton";
```

- [ ] **Step 2: Replace local booth state**

Replace:

```tsx
const [boothState, setBoothState] = useState<"idle" | "connecting" | "connected">("idle");
```

With:

```tsx
const [boothStage, setBoothStage] = useState<PhoneBoothStageName>("idle");
```

- [ ] **Step 3: Update connect flow**

Replace `handleConnect` with:

```tsx
const handleConnect = useCallback(() => {
  setBoothStage("dialing");
  setShowEndMessage(false);
  startCall();

  setTimeout(() => {
    setBoothStage("connected");
    setIsConnected(true);
    startTimer();
  }, 900);
}, [startCall, setIsConnected, startTimer]);
```

- [ ] **Step 4: Update ending flow**

Replace `handleEnd` with:

```tsx
const handleEnd = useCallback(() => {
  stopTimer();
  endCall();
  setBoothStage("ending");

  setTimeout(() => {
    setShowEndMessage(true);
  }, 520);
}, [stopTimer, endCall]);
```

- [ ] **Step 5: Replace booth JSX**

Replace the booth block inside the page with:

```tsx
<div className="relative mb-8">
  <PhoneBoothStage stage={boothStage} />

  {boothStage === "dialing" && (
    <FadeIn className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-mist-white/60 text-sm whitespace-nowrap">
      正在接通时空...
    </FadeIn>
  )}
</div>
```

- [ ] **Step 6: Replace action buttons**

Replace the end call button with:

```tsx
<TouchableButton onClick={handleEnd} variant="secondary">
  结束通话
</TouchableButton>
```

Replace the connect button with:

```tsx
<TouchableButton onClick={handleConnect}>
  接通时空
</TouchableButton>
```

Replace the modal continue button with:

```tsx
<TouchableButton onClick={handleContinue}>
  查看纪念票根
</TouchableButton>
```

- [ ] **Step 7: Keep condition checks aligned**

Replace:

```tsx
) : boothState === "idle" ? (
```

With:

```tsx
) : boothStage === "idle" ? (
```

- [ ] **Step 8: Verify call page**

Run:

```bash
npm run check
```

Expected: No TypeScript errors. `boothState` and `connecting` references no longer exist in `src/pages/CallPage.tsx`.

- [ ] **Step 9: Commit CallPage stage flow**

```bash
git add src/pages/CallPage.tsx
git commit -m "feat: refactor call page stage flow"
```

---

### Task 5: Refactor Ticket Reveal and Actions

**Files:**
- Create: `src/components/ticket/TicketActions.tsx`
- Create: `src/components/ticket/TicketReveal.tsx`
- Modify: `src/components/TicketCard.tsx`
- Modify: `src/pages/TicketPage.tsx`

- [ ] **Step 1: Create TicketActions**

Create `src/components/ticket/TicketActions.tsx`:

```tsx
import { DownloadIcon, PrintIcon, ShareIcon } from "../Icons";
import { TouchableButton } from "../TouchableButton";

interface TicketActionsProps {
  onSave: () => void;
  onPrint: () => void;
  onShare: () => void;
}

export const TicketActions = ({ onSave, onPrint, onShare }: TicketActionsProps) => (
  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
    <TouchableButton onClick={onSave} className="flex-1 flex items-center justify-center gap-2">
      <DownloadIcon />
      保存图片
    </TouchableButton>

    <TouchableButton onClick={onPrint} variant="secondary" className="flex-1 flex items-center justify-center gap-2">
      <PrintIcon />
      打印票根
    </TouchableButton>

    <TouchableButton onClick={onShare} variant="secondary" className="flex-1 flex items-center justify-center gap-2">
      <ShareIcon />
      分享
    </TouchableButton>
  </div>
);
```

- [ ] **Step 2: Create TicketReveal**

Create `src/components/ticket/TicketReveal.tsx`:

```tsx
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMotionPreferences } from "../../motion/preferences";
import { revealContainerVariants, revealItemVariants } from "../../motion/variants";

interface TicketRevealProps {
  children: ReactNode;
}

export const TicketReveal = ({ children }: TicketRevealProps) => {
  const { allowAnimation } = useMotionPreferences();

  return (
    <motion.div
      className="w-full flex flex-col items-center"
      variants={revealContainerVariants(allowAnimation)}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={revealItemVariants(allowAnimation)} className="w-full flex flex-col items-center">
        {children}
      </motion.div>
    </motion.div>
  );
};
```

- [ ] **Step 3: Update TicketCard imports**

In `src/components/TicketCard.tsx`, remove:

```tsx
import { DownloadIcon, PrintIcon, ShareIcon } from "./Icons";
```

Add:

```tsx
import { TicketActions } from "./ticket/TicketActions";
```

- [ ] **Step 4: Replace TicketCard action buttons**

Replace the action buttons block with:

```tsx
<TicketActions
  onSave={handleSave}
  onPrint={handlePrint}
  onShare={handleShare}
/>
```

Keep the `cardRef` wrapper unchanged so `html2canvas` still captures only the ticket content.

- [ ] **Step 5: Wrap TicketPage content**

In `src/pages/TicketPage.tsx`, add:

```tsx
import { TicketReveal } from "../components/ticket/TicketReveal";
import { TouchableButton } from "../components/TouchableButton";
```

Replace the inner `FadeIn` content with:

```tsx
<TicketReveal>
  <h1 className="font-serif text-2xl text-moonlight text-center mb-8">
    专属纪念票根
  </h1>

  <TicketCard ticket={ticket} />

  <TouchableButton
    onClick={handleBack}
    variant="ghost"
    className="mt-8"
  >
    返回首页
  </TouchableButton>
</TicketReveal>
```

Remove the unused `FadeIn` import if it is no longer used by `TicketPage.tsx`.

- [ ] **Step 6: Verify ticket refactor**

Run:

```bash
npm run check
```

Expected: No TypeScript errors. `TicketCard` still imports `html2canvas`, `TicketIllustration`, and `TicketBorder`.

- [ ] **Step 7: Commit ticket reveal**

```bash
git add src/components/ticket/TicketActions.tsx src/components/ticket/TicketReveal.tsx src/components/TicketCard.tsx src/pages/TicketPage.tsx
git commit -m "feat: add tactile ticket reveal"
```

---

### Task 6: Add CSS Motion Safeguards

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add reduced-motion CSS**

Append this block to `src/index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Verify CSS build**

Run:

```bash
npm run build
```

Expected: Vite build completes and emits `dist/`.

- [ ] **Step 3: Commit CSS safeguard**

```bash
git add src/index.css
git commit -m "feat: add reduced motion CSS safeguard"
```

---

### Task 7: Full Verification and Browser QA

**Files:**
- Modify only files needed to fix issues found during verification.

- [ ] **Step 1: Run static checks**

Run:

```bash
npm run check
npm run lint
npm run build
```

Expected:

- `npm run check`: exits with code 0.
- `npm run lint`: exits with code 0.
- `npm run build`: exits with code 0 and writes production assets.

- [ ] **Step 2: Start local dev server**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL, normally `http://localhost:5173/`.

- [ ] **Step 3: Browser flow check**

Open the app and complete:

```text
/ -> /entry -> /call -> /ticket
```

Verify:

- Home primary button has tactile hover/tap feedback.
- Entry form submit button is inert while invalid and tactile while valid.
- Dialing stage shows booth wake response plus signal effects.
- Connected stage shows low-intensity booth breathing.
- Ending stage contracts or fades signal before the end message.
- Ticket page reveals the ticket before actions.
- Save image still downloads a complete ticket image.

- [ ] **Step 4: Motion preference check**

In the app UI:

1. Turn `动画` off.
2. Repeat the connect and ticket flow.
3. Turn `过渡` off.
4. Navigate between pages.

Expected:

- No page gets stuck between states.
- The call can still start and end.
- The ticket can still be generated.
- Decorative loops and large movements are reduced or absent.

- [ ] **Step 5: Commit verification fixes**

If verification required fixes, commit them:

```bash
git add src
git commit -m "fix: polish motion experience verification issues"
```

If no fixes were required, do not create an empty commit.
