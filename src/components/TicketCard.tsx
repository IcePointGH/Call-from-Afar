import { useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { Ticket } from "../store/useAppStore";
import { TicketActions } from "./ticket/TicketActions";
import { TicketIllustration } from "./TicketIllustration";
import { TicketBorder } from "./TicketBorder";

interface TicketCardProps {
  ticket: Ticket;
  onSave?: () => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}分${secs}秒`;
};

export const TicketCard = ({ ticket, onSave }: TicketCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleSave = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#0a0e1a",
        logging: false,
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `时空电话亭-${ticket.timestamp.replace(/[/:]/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      onSave?.();
    } catch (error) {
      console.error("Failed to save ticket:", error);
    }
  }, [ticket, onSave]);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#0a0e1a",
        logging: false,
        useCORS: true,
      });

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
        handleSave();
      }
    } catch {
      handleSave();
    }
  }, [ticket, handleSave]);

  const handlePrint = useCallback(() => {
    if (!cardRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>时空电话亭 · 纪念票根</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Noto Sans SC', sans-serif;
            background: #0a0e1a;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20mm;
          }
          .ticket {
            width: 100%;
            max-width: 320px;
            background: linear-gradient(to bottom, #0a0e1a, rgba(107, 127, 215, 0.1));
            border-radius: 16px;
            padding: 24px;
            border: 1px solid rgba(107, 127, 215, 0.3);
            color: #f5f5f7;
          }
          .divider { display: flex; justify-content: center; margin-bottom: 16px; }
          .divider-line { width: 48px; height: 4px; background: rgba(107, 127, 215, 0.5); border-radius: 2px; }
          .title { text-align: center; font-size: 18px; color: #e8dcc4; margin-bottom: 24px; }
          .content { text-align: center; }
          .content p { margin-bottom: 16px; line-height: 1.6; }
          .name { color: #f5f5f7; }
          .highlight { color: #e8dcc4; font-weight: 500; }
          .target { color: rgba(245, 245, 247, 0.8); font-size: 14px; }
          .target-name { color: #6b7fd7; }
          .duration { font-size: 30px; font-weight: 300; color: #e8dcc4; margin: 8px 0 16px; }
          .message { color: rgba(245, 245, 247, 0.8); font-size: 14px; font-style: italic; margin-bottom: 16px; }
          .footer { color: rgba(245, 245, 247, 0.5); font-size: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(107, 127, 215, 0.2); }
          .quote { color: rgba(232, 220, 196, 0.7); font-size: 14px; font-style: italic; margin-top: 16px; }
          .dots { display: flex; justify-content: center; gap: 8px; margin-top: 24px; }
          .dot { width: 8px; height: 8px; border-radius: 50%; }
          .dot:nth-child(1), .dot:nth-child(3) { background: rgba(107, 127, 215, 0.5); }
          .dot:nth-child(2) { background: rgba(232, 220, 196, 0.5); }
          @media print {
            body { background: #0a0e1a; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .ticket { box-shadow: none; }
          }
          @page { size: A4 portrait; margin: 10mm; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="divider"><div class="divider-line"></div></div>
          <h1 class="title">时空电话亭 · 跨时空告白留存</h1>
          <div class="content">
            <p class="name">亲爱的 <span class="highlight">${ticket.userNickname || "陌生人"}</span></p>
            <p class="target">对 <span class="target-name">${ticket.targetNickname}</span> 的思念，共诉说了</p>
            <p class="duration">${formatDuration(ticket.duration)}</p>
            <p class="message">藏在心底的话，终于与时光好好道别</p>
            <p class="footer">${ticket.timestamp}</p>
          </div>
          <p class="quote">"${ticket.message}"</p>
          <div class="dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 100);
  }, [ticket]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={cardRef}
        className="relative w-80 md:w-96"
      >
        <TicketBorder>
          <div className="p-6 md:p-8" style={{ color: '#d6d6ff' }}>
            {/* 票根插图 */}
            <TicketIllustration />

            {/* 标题 */}
            <h2 className="text-center font-serif text-lg text-moonlight mb-6">
              时空电话亭 · 跨时空告白留存
            </h2>

            {/* 内容 */}
            <div className="space-y-4 text-center">
              <p className="text-mist-white">
                亲爱的{" "}
                <span className="text-moonlight font-medium">
                  {ticket.userNickname || "陌生人"}
                </span>
              </p>

              <p className="text-mist-white/80 text-sm">
                你对{" "}
                <span className="text-accent">{ticket.targetNickname}</span>{" "}
                的思念，共诉说了
              </p>

              <p className="text-3xl font-light text-moonlight">
                {formatDuration(ticket.duration)}
              </p>

              <p className="text-mist-white/50 text-xs">{ticket.timestamp}</p>
            </div>

            {/* 寄语 */}
            <div className="mt-6 pt-4 border-t border-accent/30">
              <p className="text-center text-moonlight/70 text-sm italic">
                &ldquo;{ticket.message}&rdquo;
              </p>
            </div>
          </div>
        </TicketBorder>
      </div>

      <TicketActions onSave={handleSave} onPrint={handlePrint} onShare={handleShare} />
    </div>
  );
};
