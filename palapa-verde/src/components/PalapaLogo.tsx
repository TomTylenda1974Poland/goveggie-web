/** Marca Palapa Verde (palapa con planta), recuperada del prototipo publicado en Vercel. */
export function PalapaLogo({ className, size = 34 }: { className?: string; size?: number }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 96"
      width={size}
      height={(size * 96) / 120}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
    >
      <path d="M60 6 L8 46 L112 46 Z" strokeWidth="2.6" />
      <path d="M60 12 L18 44 M60 12 L102 44 M60 20 L30 44 M60 20 L90 44 M60 29 L44 44 M60 29 L76 44" strokeWidth=".9" />
      <path d="M14 46 L13 52 M26 46 L25 53 M38 46 L37 52 M50 46 L49 53 M70 46 L71 53 M82 46 L83 52 M94 46 L95 53 M106 46 L105 52" strokeWidth=".8" />
      <path d="M20 46 L20 88 M100 46 L100 88" strokeWidth="2.4" />
      <path d="M20 54 L24 54 M20 64 L23 64 M20 74 L24 74 M100 58 L96 58 M100 70 L97 70 M100 80 L96 80" strokeWidth=".7" />
      <path d="M8 88 L112 88" strokeWidth="2" />
      <path d="M30 92 C50 90 70 90 90 92" strokeWidth=".6" />
      <path d="M60 46 L60 55" strokeWidth="1.3" />
      <path d="M60 55 C53 59 50 66 52 73 M60 55 C67 59 70 66 68 73 M60 55 L60 76" strokeWidth="1.1" />
      <path d="M60 62 L54 58 M60 66 L66 62 M60 71 L55 67 M52 73 C54 77 57 79 60 79 M68 73 C66 77 63 79 60 79" strokeWidth=".9" />
    </svg>
  );
}
