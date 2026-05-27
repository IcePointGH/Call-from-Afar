interface TicketBorderProps {
  children: React.ReactNode;
}

export const TicketBorder = ({ children }: TicketBorderProps) => {
  const holeCount = 10;
  const holesTop = Array.from({ length: holeCount }, (_, i) => i);
  const holesBottom = Array.from({ length: holeCount }, (_, i) => i);
  const holesLeft = Array.from({ length: 4 }, (_, i) => i);
  const holesRight = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div className="relative">
      {/* 顶部圆孔 */}
      <div className="absolute top-0 left-0 right-0 h-2 flex justify-between px-1">
        {holesTop.map((i) => (
          <div
            key={`top-${i}`}
            className="w-2 h-2 bg-deep-space rounded-full shadow-inner"
            style={{ marginLeft: i === 0 ? '0' : 'auto' }}
          />
        ))}
      </div>

      {/* 底部圆孔 */}
      <div className="absolute bottom-0 left-0 right-0 h-2 flex justify-between px-1">
        {holesBottom.map((i) => (
          <div
            key={`bottom-${i}`}
            className="w-2 h-2 bg-deep-space rounded-full shadow-inner"
            style={{ marginLeft: i === 0 ? '0' : 'auto' }}
          />
        ))}
      </div>

      {/* 左侧圆孔 */}
      <div className="absolute top-2 bottom-2 left-0 w-2 flex flex-col justify-between py-2">
        {holesLeft.map((i) => (
          <div
            key={`left-${i}`}
            className="w-2 h-2 bg-deep-space rounded-full shadow-inner"
          />
        ))}
      </div>

      {/* 右侧圆孔 */}
      <div className="absolute top-2 bottom-2 right-0 w-2 flex flex-col justify-between py-2">
        {holesRight.map((i) => (
          <div
            key={`right-${i}`}
            className="w-2 h-2 bg-deep-space rounded-full shadow-inner"
          />
        ))}
      </div>

      {/* 内容区域 */}
      <div className="relative bg-deep-space border border-accent/30">
        {children}
      </div>
    </div>
  );
};
