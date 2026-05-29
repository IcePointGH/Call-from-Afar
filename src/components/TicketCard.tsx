import { useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { Ticket } from "../store/useAppStore";
import { TicketActions } from "./ticket/TicketActions";
import { TicketIllustration } from "./TicketIllustration";
import { TicketBorder } from "./TicketBorder";
import { useMotionPreferences } from "../motion/preferences";
import {
  motionDelays,
  motionDurations,
  motionEase,
  motionSprings,
} from "../motion/tokens";

interface TicketCardProps {
  ticket: Ticket;
  onSave?: () => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}分${secs.toString().padStart(2, "0")}秒`;
};

const makeTicketNumber = (ticket: Ticket) => {
  const source = `${ticket.id}${ticket.duration}${ticket.targetNickname}`;
  const seed = Array.from(source).reduce((total, char) => total + char.charCodeAt(0), 0);
  return `CF-${(seed % 10000).toString().padStart(4, "0")}-${ticket.duration
    .toString()
    .padStart(3, "0")}`;
};

const barcodeWidths = [3, 1, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 1, 4, 2];

export const TicketCard = ({ ticket, onSave }: TicketCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { allowAnimation, allowTransition } = useMotionPreferences();
  const shouldMove = allowAnimation && allowTransition;
  const ticketNumber = useMemo(() => makeTicketNumber(ticket), [ticket]);

  const captureTicket = useCallback(async () => {
    if (!cardRef.current) return null;

    return html2canvas(cardRef.current, {
      scale: 2,
      backgroundColor: "#0a0e1a",
      logging: false,
      useCORS: true,
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const canvas = await captureTicket();
      if (!canvas) return;

      const link = document.createElement("a");
      link.download = `时空电话亭-${ticket.timestamp.replace(/[/:]/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      onSave?.();
    } catch (error) {
      console.error("Failed to save ticket:", error);
    }
  }, [captureTicket, ticket.timestamp, onSave]);

  const handleShare = useCallback(async () => {
    try {
      const canvas = await captureTicket();
      if (!canvas) return;

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) return;

      const file = new File([blob], "ticket.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "时空电话亭",
          text: `我对${ticket.targetNickname}的思念，共诉说了${ticket.duration}秒`,
        });
      } else {
        await handleSave();
      }
    } catch {
      await handleSave();
    }
  }, [captureTicket, handleSave, ticket.duration, ticket.targetNickname]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>时空电话亭 - 纪念票根</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20mm;
            background: #0a0e1a;
            color: #f5f5f7;
            font-family: 'Noto Sans SC', sans-serif;
          }
          .ticket {
            width: 360px;
            padding: 26px;
            border: 1px solid rgba(232, 220, 196, 0.35);
            border-radius: 10px;
            background:
              radial-gradient(circle at 15% 0%, rgba(232, 220, 196, 0.14), transparent 32%),
              radial-gradient(circle at 90% 12%, rgba(107, 127, 215, 0.24), transparent 30%),
              linear-gradient(145deg, #111a34, #0b1020 68%);
          }
          .eyebrow { display: flex; justify-content: space-between; color: rgba(245,245,247,0.54); font-size: 10px; letter-spacing: 2px; }
          .brand { margin: 18px 0 4px; text-align: center; color: #e8dcc4; font-family: 'ZCOOL XiaoWei', serif; font-size: 28px; }
          .subtitle { text-align: center; color: rgba(245,245,247,0.56); font-size: 12px; }
          .hero { margin: 22px 0; padding: 18px; border: 1px solid rgba(107,127,215,0.32); background: rgba(10,14,26,0.42); }
          .label { color: rgba(245,245,247,0.46); font-size: 11px; letter-spacing: 1.5px; }
          .target { margin-top: 6px; color: #f5f5f7; font-size: 20px; }
          .duration { margin-top: 14px; color: #e8dcc4; font-size: 36px; font-weight: 300; }
          .message { margin: 18px 0; color: rgba(232,220,196,0.78); font-size: 14px; line-height: 1.8; text-align: center; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 18px; color: rgba(245,245,247,0.72); font-size: 12px; }
          .barcode { display: flex; gap: 3px; align-items: end; height: 38px; margin-top: 20px; }
          .barcode span { display: block; width: 3px; background: rgba(232,220,196,0.66); }
          .stamp { margin-top: 18px; text-align: right; color: rgba(232,220,196,0.64); font-size: 12px; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <article class="ticket">
          <div class="eyebrow"><span>CALL FROM AFAR</span><span>${ticketNumber}</span></div>
          <h1 class="brand">时空电话亭</h1>
          <p class="subtitle">跨时空告白留存 · 专属纪念票根</p>
          <section class="hero">
            <p class="label">MESSAGE TO</p>
            <p class="target">${ticket.targetNickname}</p>
            <p class="label" style="margin-top: 18px;">CALL DURATION</p>
            <p class="duration">${formatDuration(ticket.duration)}</p>
          </section>
          <p class="message">“${ticket.message}”</p>
          <div class="meta">
            <div><p class="label">FROM</p><p>${ticket.userNickname || "陌生人"}</p></div>
            <div><p class="label">ISSUED AT</p><p>${ticket.timestamp}</p></div>
          </div>
          <div class="barcode">
            ${barcodeWidths
              .map((width, index) => `<span style="height:${18 + ((index * 7) % 20)}px;width:${width + 1}px"></span>`)
              .join("")}
          </div>
          <p class="stamp">MEMORY ACCEPTED</p>
        </article>
      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 100);
  }, [ticket, ticketNumber]);

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="relative w-[21rem] max-w-[calc(100vw-2rem)] md:w-[24rem]"
        initial={{
          y: shouldMove ? 28 : 0,
          rotateX: shouldMove ? 7 : 0,
          rotateZ: shouldMove ? -1.2 : 0,
          opacity: 0,
          filter: shouldMove ? "blur(3px)" : "blur(0px)",
        }}
        animate={{
          y: 0,
          rotateX: 0,
          rotateZ: 0,
          opacity: 1,
          filter: "blur(0px)",
        }}
        transition={shouldMove ? motionSprings.gentle : { duration: motionDurations.instant }}
        style={{ transformPerspective: 900, transformOrigin: "top center" }}
      >
        <motion.div
          className="absolute -inset-x-8 -bottom-6 h-16 rounded-full bg-black/40 blur-2xl"
          aria-hidden="true"
          initial={{ opacity: 0, scaleX: 0.74 }}
          animate={{ opacity: shouldMove ? [0, 0.5, 0.32] : 0.28, scaleX: 1 }}
          transition={{
            delay: shouldMove ? motionDelays.long : 0,
            duration: shouldMove ? motionDurations.slow : motionDurations.instant,
            ease: motionEase.softOut,
          }}
        />

        <div ref={cardRef} className="relative">
          <TicketBorder>
            <div className="relative p-6 text-mist-white md:p-7">
              <div className="mb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-mist-white/48">
                <span>Call From Afar</span>
                <span>{ticketNumber}</span>
              </div>

              <div className="text-center">
                <TicketIllustration />
                <p className="text-xs uppercase tracking-[0.28em] text-accent/80">
                  Memory Stub
                </p>
                <h2 className="mt-2 font-serif text-3xl text-moonlight">
                  时空电话亭
                </h2>
                <p className="mt-2 text-xs text-mist-white/50">
                  跨时空告白留存 · 专属纪念票根
                </p>
              </div>

              <div className="my-6 border-t border-dashed border-moonlight/24" />

              <div className="rounded-[8px] border border-accent/30 bg-deep-space/48 p-5 shadow-[inset_0_0_24px_rgba(107,127,215,0.12)]">
                <p className="text-[11px] uppercase tracking-[0.24em] text-mist-white/42">
                  Message To
                </p>
                <p className="mt-2 text-xl text-mist-white">{ticket.targetNickname}</p>

                <div className="mt-5 grid grid-cols-[1fr_auto] items-end gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-mist-white/42">
                      Call Duration
                    </p>
                    <p className="mt-1 text-4xl font-light text-moonlight">
                      {formatDuration(ticket.duration)}
                    </p>
                  </div>
                  <div className="-rotate-6 rounded-full border border-moonlight/45 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-moonlight/75">
                    Accepted
                  </div>
                </div>
              </div>

              <blockquote className="my-6 text-center text-sm leading-7 text-moonlight/78">
                “{ticket.message}”
              </blockquote>

              <div className="grid grid-cols-2 gap-4 border-y border-dashed border-moonlight/20 py-4 text-xs">
                <div>
                  <p className="mb-1 uppercase tracking-[0.18em] text-mist-white/38">From</p>
                  <p className="text-mist-white/80">{ticket.userNickname || "陌生人"}</p>
                </div>
                <div className="text-right">
                  <p className="mb-1 uppercase tracking-[0.18em] text-mist-white/38">Issued At</p>
                  <p className="text-mist-white/80">{ticket.timestamp}</p>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div className="flex h-10 items-end gap-[3px]" aria-hidden="true">
                  {barcodeWidths.map((width, index) => (
                    <span
                      key={`${width}-${index}`}
                      className="block rounded-sm bg-moonlight/65"
                      style={{
                        width: `${width + 1}px`,
                        height: `${18 + ((index * 7) % 20)}px`,
                      }}
                    />
                  ))}
                </div>

                <div className="grid h-14 w-14 grid-cols-4 gap-1 rounded-[6px] border border-moonlight/24 p-1">
                  {Array.from({ length: 16 }, (_, index) => (
                    <span
                      key={index}
                      className={
                        [0, 1, 4, 6, 9, 10, 12, 15].includes(index)
                          ? "bg-moonlight/70"
                          : "bg-accent/25"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </TicketBorder>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: shouldMove ? 14 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: shouldMove ? motionDurations.slow : 0,
          duration: shouldMove ? motionDurations.base : motionDurations.instant,
          ease: motionEase.softOut,
        }}
      >
        <TicketActions onSave={handleSave} onPrint={handlePrint} onShare={handleShare} />
      </motion.div>
    </div>
  );
};
