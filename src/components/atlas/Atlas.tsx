"use client";

import { useState } from "react";
import SectionLabel from "./SectionLabel";

type City = {
  id: string;
  name: string;
  x: number;
  y: number;
  vendors: number;
  hot: boolean;
  region: string;
};

const CITIES: City[] = [
  { id: "kyiv",     name: "Київ",         x: 0.55, y: 0.32, vendors: 1240, hot: true,  region: "столиця" },
  { id: "lviv",     name: "Львів",        x: 0.16, y: 0.40, vendors: 620,  hot: true,  region: "захід" },
  { id: "odesa",    name: "Одеса",        x: 0.47, y: 0.78, vendors: 540,  hot: false, region: "південь" },
  { id: "kharkiv",  name: "Харків",       x: 0.84, y: 0.34, vendors: 410,  hot: false, region: "схід" },
  { id: "dnipro",   name: "Дніпро",       x: 0.69, y: 0.55, vendors: 320,  hot: false, region: "центр" },
  { id: "ivano",    name: "Івано-Фр.",    x: 0.20, y: 0.55, vendors: 180,  hot: false, region: "захід" },
  { id: "uzh",      name: "Ужгород",      x: 0.07, y: 0.55, vendors: 92,   hot: false, region: "захід" },
  { id: "cherniv",  name: "Чернівці",     x: 0.27, y: 0.65, vendors: 110,  hot: false, region: "захід" },
  { id: "vinnyt",   name: "Вінниця",      x: 0.40, y: 0.45, vendors: 160,  hot: false, region: "центр" },
  { id: "poltava",  name: "Полтава",      x: 0.70, y: 0.40, vendors: 140,  hot: false, region: "центр" },
  { id: "zaporiz",  name: "Запоріжжя",    x: 0.74, y: 0.65, vendors: 220,  hot: false, region: "південь" },
  { id: "mykolaiv", name: "Миколаїв",     x: 0.58, y: 0.72, vendors: 130,  hot: false, region: "південь" },
  { id: "ternop",   name: "Тернопіль",    x: 0.24, y: 0.46, vendors: 95,   hot: false, region: "захід" },
  { id: "rivne",    name: "Рівне",        x: 0.30, y: 0.32, vendors: 88,   hot: false, region: "захід" },
  { id: "lutsk",    name: "Луцьк",        x: 0.24, y: 0.28, vendors: 76,   hot: false, region: "захід" },
  { id: "khmel",    name: "Хмельницький", x: 0.32, y: 0.46, vendors: 102,  hot: false, region: "захід" },
  { id: "zhyt",     name: "Житомир",      x: 0.42, y: 0.32, vendors: 110,  hot: false, region: "центр" },
  { id: "cherk",    name: "Черкаси",      x: 0.56, y: 0.45, vendors: 130,  hot: false, region: "центр" },
  { id: "sumy",     name: "Суми",         x: 0.74, y: 0.20, vendors: 70,   hot: false, region: "схід" },
  { id: "cherniv2", name: "Чернігів",     x: 0.60, y: 0.20, vendors: 80,   hot: false, region: "північ" },
  { id: "kropyv",   name: "Кропивницький",x: 0.55, y: 0.55, vendors: 90,   hot: false, region: "центр" },
  { id: "kherson",  name: "Херсон",       x: 0.60, y: 0.78, vendors: 110,  hot: false, region: "південь" },
];

function UAPath(W: number, H: number) {
  const pts: [number, number][] = [
    [0.06, 0.55], [0.10, 0.43], [0.13, 0.34], [0.18, 0.25], [0.24, 0.22],
    [0.30, 0.18], [0.38, 0.16], [0.46, 0.18], [0.54, 0.13], [0.62, 0.12],
    [0.70, 0.16], [0.78, 0.20], [0.84, 0.25], [0.90, 0.30], [0.93, 0.36],
    [0.94, 0.44], [0.92, 0.52], [0.88, 0.60], [0.82, 0.66], [0.78, 0.62],
    [0.72, 0.68], [0.66, 0.74], [0.60, 0.80], [0.54, 0.84], [0.48, 0.86],
    [0.42, 0.82], [0.36, 0.78], [0.30, 0.72], [0.24, 0.74], [0.18, 0.70],
    [0.12, 0.64], [0.08, 0.60],
  ];
  return "M " + pts.map(([x, y]) => `${(x * W).toFixed(1)},${(y * H).toFixed(1)}`).join(" L ") + " Z";
}

const TOP_VENUE: Record<string, string> = {
  kyiv: "Forest Hall", lviv: "Vila Magnolia", odesa: "Marina 21", kharkiv: "Loft Beton",
};
const TOP_PHOTO: Record<string, string> = { kyiv: "Olha Tkach", lviv: "Andrii Hrytsiv" };
const TOP_NEW: Record<string, string> = { kyiv: "Brass & Velvet", lviv: "Hum Catering" };

export default function Atlas() {
  const [active, setActive] = useState("kyiv");
  const city = CITIES.find(c => c.id === active)!;
  const W = 900;
  const H = 560;

  return (
    <section className="atlas-sec" id="atlas">
      <SectionLabel n="03">Географія</SectionLabel>
      <div className="atlas-head">
        <h2 className="display med">Атлас міст</h2>
        <p className="lead narrow">Натисніть на місто — побачите верифікованих виконавців у радіусі.</p>
      </div>

      <div className="atlas-wrap">
        <div className="atlas-canvas">
          <svg viewBox={`0 0 ${W} ${H}`} className="atlas-svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" className="grid-line" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="url(#grid)" opacity="0.5" />

            <path className="ua-shape" d={UAPath(W, H)} />

            {CITIES.slice(1).map(c => {
              const kyiv = CITIES[0];
              return (
                <line
                  key={c.id + "ln"}
                  x1={kyiv.x * W}
                  y1={kyiv.y * H}
                  x2={c.x * W}
                  y2={c.y * H}
                  className={`atlas-link ${active === c.id || active === "kyiv" ? "is-on" : ""}`}
                />
              );
            })}

            {CITIES.map(c => {
              const r = Math.max(5, Math.min(18, Math.sqrt(c.vendors) / 2.5));
              const isOn = active === c.id;
              return (
                <g
                  key={c.id}
                  className={`pin ${isOn ? "is-on" : ""} ${c.hot ? "is-hot" : ""}`}
                  onMouseEnter={() => setActive(c.id)}
                  onClick={() => setActive(c.id)}
                >
                  <circle cx={c.x * W} cy={c.y * H} r={r + 10} className="pin-halo" />
                  <circle cx={c.x * W} cy={c.y * H} r={r} className="pin-dot" />
                  <text
                    x={c.x * W}
                    y={c.y * H - r - 8}
                    className="pin-label"
                    textAnchor="middle"
                  >
                    {c.name}
                  </text>
                  <text x={c.x * W} y={c.y * H + 4} className="pin-num mono" textAnchor="middle">
                    {c.vendors}
                  </text>
                </g>
              );
            })}

            <g transform={`translate(${W - 80}, 70)`} className="rose">
              <circle r="34" className="rose-ring" />
              <line x1="0" y1="-30" x2="0" y2="30" />
              <line x1="-30" y1="0" x2="30" y2="0" />
              <text y="-38" textAnchor="middle" className="rose-letter">N</text>
              <text y="46" textAnchor="middle" className="rose-letter">S</text>
              <text x="-40" y="4" textAnchor="middle" className="rose-letter">W</text>
              <text x="40" y="4" textAnchor="middle" className="rose-letter">E</text>
            </g>

            <g transform={`translate(40, ${H - 40})`} className="scale">
              <line x1="0" y1="0" x2="120" y2="0" />
              <line x1="0" y1="-4" x2="0" y2="4" />
              <line x1="60" y1="-3" x2="60" y2="3" />
              <line x1="120" y1="-4" x2="120" y2="4" />
              <text x="0" y="18" className="mono">0</text>
              <text x="120" y="18" className="mono">200km</text>
            </g>
          </svg>
        </div>

        <aside className="atlas-readout">
          <div className="ar-coord mono">
            ⊹ {city.id.toUpperCase()} · {city.region}
          </div>
          <h3 className="ar-name italic">{city.name}</h3>
          <div className="ar-stat">
            <div>
              <b>{city.vendors}</b>
              <span>виконавців</span>
            </div>
            <div>
              <b>{Math.round(city.vendors * 0.42)}</b>
              <span>верифікованих</span>
            </div>
            <div>
              <b>{Math.round(city.vendors / 30)}</b>
              <span>заходів/тиждень</span>
            </div>
          </div>
          <div className="ar-list">
            <div className="ar-row">
              <span className="mono">01</span>
              <span>Топ-локація: {TOP_VENUE[city.id] || `${city.name} Hall`}</span>
            </div>
            <div className="ar-row">
              <span className="mono">02</span>
              <span>Найзайнятіший: {TOP_PHOTO[city.id] || "studio.lens"}</span>
            </div>
            <div className="ar-row">
              <span className="mono">03</span>
              <span>Новачок місяця: {TOP_NEW[city.id] || "atelier vy"}</span>
            </div>
          </div>
          <a className="readout-cta" href={`/catalog?city=${city.id}`}>
            всі виконавці у {city.name} <span>↗</span>
          </a>

          <div className="ar-legend">
            <span className="dot" />
            <span className="mono">розмір кола = к-сть виконавців</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
