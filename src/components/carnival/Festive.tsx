// Carnival decorative primitives: marquee bulb frame, fireworks SVG, balloons, section head, ticker.

export function MarqueeFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="marquee">
      <div className="marquee-row top">
        <Bulbs n={26} />
      </div>
      <div className="marquee-row bottom">
        <Bulbs n={26} />
      </div>
      <div className="marquee-col left">
        <Bulbs n={10} vertical />
      </div>
      <div className="marquee-col right">
        <Bulbs n={10} vertical />
      </div>
      <div className="marquee-corners">
        <span /><span /><span /><span />
      </div>
      <div className="marquee-inner">{children}</div>
    </div>
  );
}

function Bulbs({ n, vertical = false }: { n: number; vertical?: boolean }) {
  return (
    <div className={`bulbs ${vertical ? "v" : ""}`}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="bulb" style={{ animationDelay: `${(i % 4) * 0.15}s` }} />
      ))}
    </div>
  );
}

export function Firework({
  x,
  y,
  hue,
  delay = 0,
  size = 60,
}: {
  x: number;
  y: number;
  hue: string;
  delay?: number;
  size?: number;
}) {
  const rays = 12;
  return (
    <svg
      className="firework"
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s`, width: size, height: size }}
      viewBox="-50 -50 100 100"
    >
      {Array.from({ length: rays }).map((_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const x2 = Math.cos(a) * 40;
        const y2 = Math.sin(a) * 40;
        return (
          <line
            key={i}
            x1="0"
            y1="0"
            x2={x2}
            y2={y2}
            stroke={hue}
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      {Array.from({ length: rays }).map((_, i) => {
        const a = (i / rays) * Math.PI * 2;
        const x2 = Math.cos(a) * 38;
        const y2 = Math.sin(a) * 38;
        return <circle key={i} cx={x2} cy={y2} r="3" fill={hue} />;
      })}
    </svg>
  );
}

export function Balloon({
  color,
  x,
  delay = 0,
  size = 70,
}: {
  color: string;
  x: number;
  delay?: number;
  size?: number;
}) {
  return (
    <div
      className="balloon"
      style={{ left: `${x}%`, animationDelay: `${delay}s`, width: size, height: size * 1.7 }}
    >
      <svg viewBox="0 0 60 100">
        <ellipse cx="30" cy="36" rx="28" ry="34" fill={color} />
        <ellipse cx="22" cy="26" rx="6" ry="10" fill="rgba(255,255,255,0.4)" />
        <polygon points="26,68 34,68 30,76" fill={color} />
        <path
          d="M30 76 Q26 82 32 88 Q28 92 30 100"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
}

export function SectionHead({
  n,
  kicker,
  title,
  sub,
}: {
  n: string;
  kicker: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="sh">
      <div className="sh-kicker mono">
        <span className="sh-num">{n}</span>
        <span className="sh-bar" />
        <span>{kicker}</span>
        <span className="sh-bar" />
        <span className="sh-spark">✦</span>
      </div>
      <h2 className="sh-title">{title}</h2>
      {sub && <p className="sh-sub">{sub}</p>}
    </div>
  );
}

const TICKER_LINES = [
  "Микола & Софія забронювали Vila Tysha · 18.06",
  "Studio Polonyna · 12 нових слотів на серпень",
  "AI підібрав 8 команд за останню хвилину",
  "Brass & Velvet · live у Львові 22.06",
  "Hum Catering · сезонне меню «Поділля»",
  "+ 14 нових майстрів за добу",
];

export function Ticker() {
  const items = [...TICKER_LINES, ...TICKER_LINES, ...TICKER_LINES];
  return (
    <div className="ticker">
      <span className="ticker-tag">
        <i className="dot" /> LIVE
      </span>
      <div className="ticker-track">
        {items.map((s, i) => (
          <span key={i} className="ticker-item">
            {s}
            <i className="sep">✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}
