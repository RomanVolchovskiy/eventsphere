"use client";

import { useState } from "react";
import SectionLabel from "./SectionLabel";

const SECTORS = [
  { key: "venue",  label: "Локації",       sub: "240+ просторів",   href: "/catalog?cat=venue",          glyph: "✦" },
  { key: "show",   label: "Шоу-програма",  sub: "180+ артистів",     href: "/catalog?cat=entertainment",  glyph: "♫" },
  { key: "food",   label: "Кейтеринг",     sub: "95+ кухонь",        href: "/catalog?cat=catering",       glyph: "✻" },
  { key: "photo",  label: "Фото & відео",  sub: "320+ авторів",      href: "/catalog?cat=photo",          glyph: "◉" },
  { key: "decor",  label: "Декор",         sub: "150+ студій",       href: "/catalog?cat=decor",          glyph: "❋" },
  { key: "music",  label: "DJ & гурти",    sub: "210+ виступів",     href: "/catalog?cat=music",          glyph: "♪" },
  { key: "host",   label: "Ведучі",        sub: "140+ голосів",      href: "/catalog?cat=host",           glyph: "✺" },
  { key: "sweet",  label: "Солодкий стіл", sub: "80+ кондитерських", href: "/catalog?cat=sweet",          glyph: "❀" },
];

const SAMPLE_VENDORS = ["Topvendor Studio", "Atelier Vy", "Hum Crew", "Polonyna Co."];

export default function Compass() {
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const focused = active ?? hover;

  const SIZE = 720;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const rOuter = 330;
  const rInner = 130;
  const N = SECTORS.length;
  const seg = (Math.PI * 2) / N;
  const a0 = -Math.PI / 2 - seg / 2;

  const arcPath = (i: number) => {
    const start = a0 + i * seg;
    const end = a0 + (i + 1) * seg;
    const x1 = cx + Math.cos(start) * rInner;
    const y1 = cy + Math.sin(start) * rInner;
    const x2 = cx + Math.cos(start) * rOuter;
    const y2 = cy + Math.sin(start) * rOuter;
    const x3 = cx + Math.cos(end) * rOuter;
    const y3 = cy + Math.sin(end) * rOuter;
    const x4 = cx + Math.cos(end) * rInner;
    const y4 = cy + Math.sin(end) * rInner;
    return `M${x1},${y1} L${x2},${y2} A${rOuter},${rOuter} 0 0 1 ${x3},${y3} L${x4},${y4} A${rInner},${rInner} 0 0 0 ${x1},${y1} Z`;
  };

  const labelPos = (i: number) => {
    const mid = a0 + i * seg + seg / 2;
    const r = (rOuter + rInner) / 2;
    return { x: cx + Math.cos(mid) * r, y: cy + Math.sin(mid) * r };
  };

  const tickPos = (i: number) => {
    const mid = a0 + i * seg + seg / 2;
    const r = rOuter + 22;
    return { x: cx + Math.cos(mid) * r, y: cy + Math.sin(mid) * r };
  };

  return (
    <section className="compass-sec" id="compass">
      <SectionLabel n="02">Навігація</SectionLabel>
      <div className="compass-head">
        <h2 className="display med italic">Компас послуг</h2>
        <p className="lead narrow">Оберіть напрямок — і платформа поверне вас до десятків майстрів.</p>
      </div>

      <div className="compass-wrap">
        <div className="compass-stage">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="compass-svg">
            <circle cx={cx} cy={cy} r={rOuter + 30} className="ring guide" />
            <circle cx={cx} cy={cy} r={rOuter} className="ring" />
            <circle cx={cx} cy={cy} r={rInner} className="ring" />

            {SECTORS.map((s, i) => (
              <path
                key={s.key}
                d={arcPath(i)}
                className={`sector ${focused === i ? "is-on" : ""}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setActive(active === i ? null : i)}
              />
            ))}

            {SECTORS.map((s, i) => {
              const p = labelPos(i);
              return (
                <g
                  key={s.key}
                  className={`sector-label ${focused === i ? "is-on" : ""}`}
                  pointerEvents="none"
                >
                  <text x={p.x} y={p.y - 6} className="glyph" textAnchor="middle">
                    {s.glyph}
                  </text>
                  <text x={p.x} y={p.y + 14} className="lbl" textAnchor="middle">
                    {s.label}
                  </text>
                </g>
              );
            })}

            {SECTORS.map((s, i) => {
              const p = tickPos(i);
              return (
                <text
                  key={s.key}
                  x={p.x}
                  y={p.y}
                  className="tick mono"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {String(i + 1).padStart(2, "0")}
                </text>
              );
            })}

            <line x1={cx} y1={20} x2={cx} y2={SIZE - 20} className="cross" />
            <line x1={20} y1={cy} x2={SIZE - 20} y2={cy} className="cross" />

            <circle cx={cx} cy={cy} r={rInner - 18} className="hub" />
          </svg>

          <div className="compass-hub">
            <div className="hub-glyph">✦</div>
            <div className="hub-name italic">ЄСвято</div>
            <div className="hub-hint mono">Натисніть на сегмент</div>
          </div>
        </div>

        <aside className="compass-readout">
          <div className="readout-num mono">
            {focused != null ? String(focused + 1).padStart(2, "0") : "––"} / {String(N).padStart(2, "0")}
          </div>
          {focused != null ? (
            <>
              <div className="readout-glyph">{SECTORS[focused].glyph}</div>
              <h3 className="readout-name italic">{SECTORS[focused].label}</h3>
              <p className="readout-sub">{SECTORS[focused].sub}</p>
              <div className="readout-list">
                {SAMPLE_VENDORS.map((n, i) => (
                  <div key={i} className="readout-row">
                    <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                    <span>{n}</span>
                    <span className="mono dim">⋆ 4.{9 - i}</span>
                  </div>
                ))}
              </div>
              <a className="readout-cta" href={SECTORS[focused].href}>
                відкрити каталог <span>↗</span>
              </a>
            </>
          ) : (
            <>
              <div className="readout-glyph dim">∘</div>
              <h3 className="readout-name italic dim">
                Наведіть курсор
                <br />
                на сектор
              </h3>
              <p className="readout-sub">
                Кожен напрямок розкриває окрему частину каталогу — від локацій до солодкого столу.
              </p>
              <div className="readout-grid">
                {SECTORS.map((s, i) => (
                  <button
                    key={s.key}
                    className="readout-chip"
                    onClick={() => setActive(i)}
                    type="button"
                  >
                    <span className="mono">{String(i + 1).padStart(2, "0")}</span> {s.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
