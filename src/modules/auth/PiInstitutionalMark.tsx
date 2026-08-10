interface PiInstitutionalMarkProps {
  className?: string;
}

/** Vector mark used exclusively by the institutional login entry. */
export function PiInstitutionalMark({ className = "" }: PiInstitutionalMarkProps) {
  return (
    <svg
      aria-label="Pi Web V2"
      className={className}
      fill="none"
      role="img"
      viewBox="0 0 88 72"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pi-mark-gold" x1="15" x2="69" y1="8" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF3C9" />
          <stop offset="0.46" stopColor="#D6AA42" />
          <stop offset="1" stopColor="#8F6418" />
        </linearGradient>
      </defs>
      <path d="M17 9H46.5C60.6 9 70 17.7 70 30.3C70 43.1 60.6 51.7 46.5 51.7H31.2V64H17V9ZM31.2 21.4V39.2H45.8C52 39.2 55.8 36.1 55.8 30.3C55.8 24.5 52 21.4 45.8 21.4H31.2Z" fill="url(#pi-mark-gold)" />
      <path d="M17 64H70" stroke="#D6AA42" strokeLinecap="round" strokeWidth="2" />
      <circle cx="75.5" cy="58.5" fill="#D6AA42" r="3.5" />
    </svg>
  );
}
