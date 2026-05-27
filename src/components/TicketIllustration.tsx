export const TicketIllustration = () => (
  <svg
    viewBox="0 0 280 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto max-w-xs mx-auto mb-6"
  >
    {/* 星星装饰 */}
    <circle cx="40" cy="20" r="3" fill="#f5f5f7" opacity="0.6" />
    <circle cx="80" cy="35" r="2" fill="#f5f5f7" opacity="0.4" />
    <circle cx="200" cy="25" r="2.5" fill="#f5f5f7" opacity="0.5" />
    <circle cx="240" cy="15" r="2" fill="#f5f5f7" opacity="0.3" />

    {/* 月牙 */}
    <path
      d="M250 45C250 55.5 241.5 64 231 64C220.5 64 212 55.5 212 45C212 34.5 220.5 26 231 26C233.38 26 235.67 26.36 237.77 27.02C234.76 30.61 233 35.23 233 40.25C233 47.93 237.58 54.44 243.89 57.19L250 45Z"
      fill="#e8dcc4"
    />

    {/* 电话亭剪影 - 简约风格 */}
    <g transform="translate(70, 10)">
      {/* 亭顶 */}
      <path d="M20 25 L35 8 L105 8 L120 25 Z" fill="#5a6db8" />
      {/* 亭身 */}
      <rect x="20" y="25" width="100" height="55" rx="4" fill="#6b7fd7" />
      {/* 内部 */}
      <rect x="30" y="32" width="80" height="42" rx="2" fill="#4a5a8a" />
      {/* 电话听筒 */}
      <rect x="50" y="45" width="40" height="14" rx="7" fill="#e8dcc4" />
      <circle cx="55" cy="52" r="7" fill="#e8dcc4" />
      <circle cx="85" cy="52" r="7" fill="#e8dcc4" />
    </g>

    {/* 底部星光线 */}
    <line x1="60" y1="90" x2="90" y2="90" stroke="#6b7fd7" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    <line x1="130" y1="90" x2="150" y2="90" stroke="#e8dcc4" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    <line x1="190" y1="90" x2="220" y2="90" stroke="#6b7fd7" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </svg>
);
