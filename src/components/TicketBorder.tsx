interface TicketBorderProps {
  children: React.ReactNode;
}

export const TicketBorder = ({ children }: TicketBorderProps) => {
  const topHoles = Array.from({ length: 14 }, (_, index) => index);
  const sideHoles = Array.from({ length: 7 }, (_, index) => index);

  return (
    <div className="relative">
      <div className="absolute -left-3 -top-3 h-10 w-10 rounded-full bg-deep-space" />
      <div className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-deep-space" />
      <div className="absolute -bottom-3 -left-3 h-10 w-10 rounded-full bg-deep-space" />
      <div className="absolute -bottom-3 -right-3 h-10 w-10 rounded-full bg-deep-space" />

      <div className="absolute left-5 right-5 top-0 flex -translate-y-1/2 justify-between">
        {topHoles.map((hole) => (
          <span
            key={`top-${hole}`}
            className="h-2 w-2 rounded-full bg-deep-space shadow-inner"
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-5 right-5 flex translate-y-1/2 justify-between">
        {topHoles.map((hole) => (
          <span
            key={`bottom-${hole}`}
            className="h-2 w-2 rounded-full bg-deep-space shadow-inner"
          />
        ))}
      </div>

      <div className="absolute bottom-8 left-0 top-8 flex -translate-x-1/2 flex-col justify-between">
        {sideHoles.map((hole) => (
          <span
            key={`left-${hole}`}
            className="h-2.5 w-2.5 rounded-full bg-deep-space shadow-inner"
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-0 top-8 flex translate-x-1/2 flex-col justify-between">
        {sideHoles.map((hole) => (
          <span
            key={`right-${hole}`}
            className="h-2.5 w-2.5 rounded-full bg-deep-space shadow-inner"
          />
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[10px] border border-moonlight/25 bg-[#10172d] shadow-[inset_0_0_0_1px_rgba(245,245,247,0.04),0_24px_70px_rgba(2,4,10,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(232,220,196,0.16),transparent_34%),radial-gradient(circle_at_90%_15%,rgba(107,127,215,0.22),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
};
