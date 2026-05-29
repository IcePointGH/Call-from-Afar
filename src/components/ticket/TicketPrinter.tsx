import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TouchableButton } from "../TouchableButton";
import { useMotionPreferences } from "../../motion/preferences";
import {
  motionDelays,
  motionDurations,
  motionEase,
  motionSprings,
} from "../../motion/tokens";

type PrintStage = "ready" | "printing" | "printed";

interface TicketPrinterProps {
  targetNickname: string;
  duration: number;
  onOpenTicket: () => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}分${secs}秒`;
};

export const TicketPrinter = ({
  targetNickname,
  duration,
  onOpenTicket,
}: TicketPrinterProps) => {
  const [stage, setStage] = useState<PrintStage>("ready");
  const { allowAnimation, allowTransition } = useMotionPreferences();
  const shouldMove = allowAnimation && allowTransition;
  const isPrinting = stage === "printing";
  const isPrinted = stage === "printed";

  useEffect(() => {
    if (!isPrinting) return;

    const timeoutId = window.setTimeout(
      () => setStage("printed"),
      shouldMove ? 1450 : 120
    );

    return () => window.clearTimeout(timeoutId);
  }, [isPrinting, shouldMove]);

  const startPrint = () => {
    if (stage !== "ready") return;
    setStage("printing");
  };

  return (
    <motion.div
      className="relative w-full max-w-sm text-center"
      initial={{ opacity: 0, y: shouldMove ? 18 : 0, scale: shouldMove ? 0.98 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={shouldMove ? motionSprings.gentle : { duration: motionDurations.instant }}
    >
      <div className="relative mx-auto mb-7 h-72 w-72">
        <motion.div
          className="absolute inset-x-6 bottom-0 h-8 rounded-full bg-black/35 blur-xl"
          animate={{
            opacity: isPrinting || isPrinted ? 0.42 : 0.24,
            scaleX: isPrinted ? 1.1 : 0.86,
          }}
          transition={shouldMove ? motionSprings.gentle : { duration: motionDurations.instant }}
        />

        <motion.div
          className="absolute inset-x-4 top-3 h-48 rounded-2xl border border-accent/40 bg-[#121a35] shadow-[inset_0_0_28px_rgba(107,127,215,0.2),0_24px_60px_rgba(2,4,10,0.36)]"
          animate={
            shouldMove && isPrinting
              ? { x: [-2, 2, -1, 1, 0] }
              : { x: 0 }
          }
          transition={{
            duration: shouldMove && isPrinting ? 0.28 : motionDurations.instant,
            repeat: shouldMove && isPrinting ? 4 : 0,
            ease: motionEase.standard,
          }}
        >
          <div className="absolute left-6 right-6 top-5 h-8 rounded-lg border border-moonlight/15 bg-deep-space/80">
            <motion.div
              className="mx-auto mt-2 h-2 w-28 rounded-full bg-moonlight"
              animate={{
                opacity: isPrinting ? [0.34, 1, 0.5] : isPrinted ? 0.78 : 0.34,
                boxShadow:
                  isPrinting || isPrinted
                    ? "0 0 18px rgba(232,220,196,0.5)"
                    : "0 0 0 rgba(232,220,196,0)",
              }}
              transition={{
                duration: shouldMove && isPrinting ? 0.48 : motionDurations.fast,
                repeat: shouldMove && isPrinting ? Infinity : 0,
                repeatType: "mirror",
                ease: motionEase.standard,
              }}
            />
          </div>

          <div className="absolute left-8 right-8 top-20 h-16 rounded-xl border border-accent/20 bg-call-panel/70">
            <div className="absolute left-1/2 top-4 h-3 w-32 -translate-x-1/2 rounded-full bg-deep-space shadow-inner" />
            <motion.div
              className="absolute left-1/2 top-4 h-3 w-28 -translate-x-1/2 rounded-full bg-moonlight/80"
              animate={{
                opacity: isPrinting ? [0.15, 0.88, 0.22] : isPrinted ? 0.52 : 0.18,
              }}
              transition={{
                duration: shouldMove && isPrinting ? 0.34 : motionDurations.fast,
                repeat: shouldMove && isPrinting ? Infinity : 0,
                ease: motionEase.standard,
              }}
            />
          </div>

          <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between rounded-xl bg-deep-space/70 px-5 py-4">
            <div className="text-left">
              <p className="text-xs text-mist-white/45">OUTPUT</p>
              <p className="text-sm text-moonlight">
                {isPrinted ? "票根已打印" : isPrinting ? "正在打印" : "等待打印"}
              </p>
            </div>
            <motion.div
              className="h-5 w-5 rounded-full border border-moonlight/30"
              animate={{
                backgroundColor: isPrinting || isPrinted ? "#e8dcc4" : "#28345f",
                boxShadow:
                  isPrinting || isPrinted
                    ? "0 0 18px rgba(232,220,196,0.6)"
                    : "0 0 0 rgba(232,220,196,0)",
                scale: isPrinting ? [1, 1.22, 1] : 1,
              }}
              transition={{
                duration: shouldMove && isPrinting ? 0.52 : motionDurations.fast,
                repeat: shouldMove && isPrinting ? Infinity : 0,
                ease: motionEase.standard,
              }}
            />
          </div>
        </motion.div>

        <motion.button
          type="button"
          className="absolute left-12 right-12 top-[118px] z-10 rounded-lg border border-moonlight/25 bg-[#f0e4c8] p-4 text-left text-deep-space shadow-[0_14px_34px_rgba(2,4,10,0.35)] focus:outline-none focus:ring-2 focus:ring-moonlight/70"
          onClick={isPrinted ? onOpenTicket : undefined}
          disabled={!isPrinted}
          aria-label={isPrinted ? "查看打印出的纪念票根" : "纪念票根正在打印"}
          initial={{ opacity: 0, y: -26, scaleY: 0.36 }}
          animate={{
            opacity: stage === "ready" ? 0 : 1,
            y: isPrinted ? 72 : isPrinting ? [0, 26, 50] : 0,
            scaleY: isPrinting ? [0.36, 0.72, 1] : 1,
            rotate: isPrinted ? -1.2 : 0,
          }}
          transition={
            shouldMove
              ? {
                  duration: isPrinting ? 1.2 : motionDurations.base,
                  times: isPrinting ? [0, 0.62, 1] : undefined,
                  ease: motionEase.softOut,
                }
              : { duration: motionDurations.instant }
          }
        >
          <div className="mb-3 flex items-center justify-between border-b border-deep-space/20 pb-2">
            <span className="text-xs font-semibold tracking-[0.22em]">CALL STUB</span>
            <span className="text-xs">{formatDuration(duration)}</span>
          </div>
          <p className="text-sm font-semibold">给 {targetNickname || "ta"} 的时空留言</p>
          <p className="mt-2 text-xs text-deep-space/65">
            {isPrinted ? "点击展开完整纪念票根" : "正在记录通话余温"}
          </p>
        </motion.button>
      </div>

      <motion.p
        className="mb-5 text-sm text-mist-white/60"
        animate={{ opacity: isPrinted ? 0.78 : 0.58 }}
        transition={shouldMove ? motionSprings.gentle : { duration: motionDurations.instant }}
      >
        {isPrinted
          ? "票根已经吐出，轻触纸面查看完整留存。"
          : isPrinting
            ? "纸张正在穿过时空出票口。"
            : "按下打印键，把这段通话留成一张实体票根。"}
      </motion.p>

      {!isPrinted ? (
        <TouchableButton
          onClick={startPrint}
          disabled={isPrinting}
          className="min-w-44"
        >
          {isPrinting ? "打印中..." : "打印票根"}
        </TouchableButton>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: shouldMove ? 10 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: shouldMove ? motionDelays.short : 0,
            duration: shouldMove ? motionDurations.base : motionDurations.instant,
            ease: motionEase.softOut,
          }}
        >
          <TouchableButton onClick={onOpenTicket} className="min-w-44">
            查看票根详情
          </TouchableButton>
        </motion.div>
      )}
    </motion.div>
  );
};
