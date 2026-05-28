"use client";

import { useMemo, useState } from "react";
import { SectionHead } from "./Festive";

const EVENTS: [string, string][] = [
  ["wedding", "Весілля"],
  ["corp", "Корпоратив"],
  ["bday", "День н."],
  ["private", "Приватна"],
];
const STYLES: [string, string][] = [
  ["minimal", "Мінімал"],
  ["luxe", "Люкс"],
  ["bohemian", "Богема"],
  ["rustic", "Рустик"],
];

export default function SmartMatch() {
  const [event, setEvent] = useState("wedding");
  const [style, setStyle] = useState("luxe");
  const [budget, setBudget] = useState(60);

  const matches = useMemo(() => {
    const base = [
      { name: "Forest Hall",    role: "ЛОКАЦІЯ",   fit: 96 },
      { name: "Olha Tkach",     role: "ФОТОГРАФ",  fit: 94 },
      { name: "Hum Catering",   role: "КЕЙТЕРИНГ", fit: 91 },
      { name: "Brass & Velvet", role: "ГУРТ",      fit: 89 },
    ];
    return base.map((m, i) => ({
      ...m,
      fit: Math.max(
        60,
        Math.min(
          99,
          m.fit -
            i * 2 +
            (style === "minimal" ? -3 : style === "luxe" ? 2 : 0) +
            (budget > 70 ? 1 : -1),
        ),
      ),
    }));
  }, [budget, style, event]);

  return (
    <section className="match-sec" id="smart-match">
      <SectionHead
        n="05"
        kicker="AI Smart Match"
        title={
          <>
            Команда мрії <em>за 60 сек</em>
          </>
        }
        sub="2 400+ профілів проходять через 14 шарів моделі — і повертаються 4 ідеальних виконавця. Спробуй зараз."
      />
      <div className="match-frame">
        <div className="match-controls">
          <div className="ctrl">
            <div className="ctrl-label mono">01 · Подія</div>
            <div className="seg">
              {EVENTS.map(([id, l]) => (
                <button
                  key={id}
                  className={event === id ? "on" : ""}
                  onClick={() => setEvent(id)}
                  type="button"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="ctrl">
            <div className="ctrl-label mono">02 · Стиль</div>
            <div className="seg">
              {STYLES.map(([id, l]) => (
                <button
                  key={id}
                  className={style === id ? "on" : ""}
                  onClick={() => setStyle(id)}
                  type="button"
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="ctrl">
            <div className="ctrl-label mono">
              03 · Бюджет ₴ {(budget * 10).toLocaleString("uk-UA")} тис.
            </div>
            <input
              type="range"
              min={20}
              max={200}
              value={budget}
              onChange={e => setBudget(+e.target.value)}
              className="slider"
            />
            <div className="slider-marks mono">
              <span>20к</span>
              <span>100к</span>
              <span>2М+</span>
            </div>
          </div>
        </div>
        <div className="match-output">
          <div className="mo-top">
            <span className="mono dim">RESULT · CONFIDENCE 92%</span>
            <a href="/smart-match" className="btn-line sm">
              Завантажити команду →
            </a>
          </div>
          {matches.map((m, i) => (
            <div key={m.name} className="mo-row" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="mo-fit">
                <svg viewBox="0 0 40 40" width="44" height="44">
                  <defs>
                    <linearGradient id="fitGr" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#FFC857" />
                      <stop offset="1" stopColor="#FF3D80" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="20"
                    cy="20"
                    r="17"
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="17"
                    fill="none"
                    stroke="url(#fitGr)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={`${(m.fit / 100) * 2 * Math.PI * 17} 999`}
                    transform="rotate(-90 20 20)"
                  />
                </svg>
                <span className="mono">{m.fit}</span>
              </div>
              <div className="mo-body">
                <div className="mo-role mono">{m.role}</div>
                <div className="mo-name">{m.name}</div>
              </div>
              <button className="mo-pin" type="button">+</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
