export const TicketIllustration = () => (
  <svg
    viewBox="0 0 320 118"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-6 h-auto w-full max-w-xs"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ticketBoothBody" x1="160" y1="16" x2="160" y2="105">
        <stop stopColor="#7d91ee" />
        <stop offset="1" stopColor="#405399" />
      </linearGradient>
      <linearGradient id="ticketGlass" x1="128" y1="41" x2="197" y2="88">
        <stop stopColor="#d9e2ff" stopOpacity="0.42" />
        <stop offset="1" stopColor="#151c35" stopOpacity="0.62" />
      </linearGradient>
      <filter id="ticketSoftGlow" x="78" y="0" width="166" height="126">
        <feGaussianBlur stdDeviation="10" />
      </filter>
    </defs>

    <circle
      cx="160"
      cy="62"
      r="52"
      fill="#6b7fd7"
      opacity="0.16"
      filter="url(#ticketSoftGlow)"
    />
    <path
      d="M110 37 L124 13 H196 L210 37 Z"
      fill="#5265bc"
    />
    <path
      d="M121 31 L130 19 H190 L199 31 Z"
      fill="#171f3a"
      opacity="0.66"
    />
    <rect x="107" y="36" width="106" height="71" rx="8" fill="url(#ticketBoothBody)" />
    <rect x="119" y="48" width="82" height="48" rx="5" fill="url(#ticketGlass)" />
    <line x1="160" y1="48" x2="160" y2="96" stroke="#8fa1ff" strokeWidth="3" />
    <line x1="119" y1="70" x2="201" y2="70" stroke="#8fa1ff" strokeWidth="3" opacity="0.82" />

    <rect x="139" y="58" width="42" height="12" rx="6" fill="#e8dcc4" />
    <circle cx="140" cy="64" r="6.5" fill="#e8dcc4" />
    <circle cx="180" cy="64" r="6.5" fill="#e8dcc4" />
    <path
      d="M176 70 C184 77 185 86 178 91"
      stroke="#e8dcc4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="1 5"
      opacity="0.7"
    />

    <path d="M98 108 H222" stroke="#6b7fd7" strokeWidth="2" strokeLinecap="round" />
    <path d="M44 26 H70" stroke="#e8dcc4" strokeWidth="1.5" strokeLinecap="round" opacity="0.38" />
    <path d="M250 92 H281" stroke="#e8dcc4" strokeWidth="1.5" strokeLinecap="round" opacity="0.36" />
    <circle cx="67" cy="73" r="3" fill="#f5f5f7" opacity="0.42" />
    <circle cx="246" cy="32" r="2.5" fill="#f5f5f7" opacity="0.48" />
    <circle cx="267" cy="62" r="1.8" fill="#f5f5f7" opacity="0.36" />
  </svg>
);
