"use client";

import { useState } from "react";
import SectionLabel from "./SectionLabel";

const SMART_STEPS = [
  {
    title: "Подія",
    options: [
      { id: "wedding", label: "Весілля",    icon: "❀", note: "120 гостей" },
      { id: "corp",    label: "Корпоратив", icon: "✻", note: "200 гостей" },
      { id: "bday",    label: "День н.",    icon: "✦", note: "30 гостей" },
      { id: "private", label: "Приватний",  icon: "◉", note: "до 12 гостей" },
    ],
  },
  {
    title: "Стиль",
    options: [
      { id: "rustic",   label: "Рустик",  icon: "✻", note: "автентика" },
      { id: "minimal",  label: "Мінімал", icon: "—", note: "лаконіка" },
      { id: "luxe",     label: "Люкс",    icon: "✦", note: "преміум" },
      { id: "bohemian", label: "Богема",  icon: "❋", note: "вільно" },
    ],
  },
  {
    title: "Бюджет",
    options: [
      { id: "b1", label: "до ₴80 000", icon: "₴",   note: "стартовий" },
      { id: "b2", label: "₴80–250к",   icon: "₴₴",  note: "середній" },
      { id: "b3", label: "₴250–600к",  icon: "₴₴₴", note: "розширений" },
      { id: "b4", label: "₴600к+",     icon: "✦",   note: "без меж" },
    ],
  },
];

const MATCH_RESULTS = [
  { name: "Studio Polonyna", role: "Локація",    price: "₴ 220 000", rating: 4.9, fit: 96 },
  { name: "Olha Tkach",      role: "Фотограф",   price: "₴ 38 000",  rating: 5.0, fit: 94 },
  { name: "Hum Catering",    role: "Кейтеринг",  price: "₴ 162 000", rating: 4.8, fit: 91 },
  { name: "Brass & Velvet",  role: "Гурт",       price: "₴ 54 000",  rating: 4.9, fit: 89 },
];

export default function SmartMatch() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<number, string>>({});

  const setPick = (id: string) => {
    const next = { ...picks, [step]: id };
    setPicks(next);
    setTimeout(() => setStep(s => Math.min(s + 1, SMART_STEPS.length)), 280);
  };

  const reset = () => {
    setPicks({});
    setStep(0);
  };

  const isDone = step >= SMART_STEPS.length;

  return (
    <section className="smart-sec" id="smart">
      <SectionLabel n="04">Інтелект</SectionLabel>
      <div className="smart-head">
        <h2 className="display med italic">Smart Match — за три рухи</h2>
        <p className="lead narrow">AI підбирає команду виконавців під ваш бюджет, дату та настрій.</p>
      </div>

      <div className="smart-frame">
        <div className="smart-rail">
          {SMART_STEPS.map((s, i) => (
            <div key={i} className={`rail-item ${i === step ? "now" : ""} ${i < step ? "done" : ""}`}>
              <span className="mono">0{i + 1}</span>
              <span>{s.title}</span>
              {i < step && (
                <span className="rail-pick">
                  {SMART_STEPS[i].options.find(o => o.id === picks[i])?.label}
                </span>
              )}
            </div>
          ))}
          <div className={`rail-item ${isDone ? "now" : ""}`}>
            <span className="mono">04</span>
            <span>Команда</span>
          </div>
        </div>

        <div className="smart-stage">
          {!isDone ? (
            <>
              <div className="smart-q italic">{SMART_STEPS[step].title}</div>
              <div className="smart-options">
                {SMART_STEPS[step].options.map(o => (
                  <button
                    key={o.id}
                    className="opt"
                    onClick={() => setPick(o.id)}
                    type="button"
                  >
                    <span className="opt-icon">{o.icon}</span>
                    <span className="opt-lbl">{o.label}</span>
                    <span className="opt-note mono">{o.note}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="smart-results">
              <div className="results-head">
                <div>
                  <div className="mono dim">RESULT · 4 MATCHES · CONFIDENCE 92%</div>
                  <h3 className="italic">Ваша команда на свято</h3>
                </div>
                <button className="btn-mini" onClick={reset} type="button">
                  ↺ ще раз
                </button>
              </div>
              <div className="results-grid">
                {MATCH_RESULTS.map((r, i) => (
                  <div
                    key={i}
                    className="match-card"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <div className="match-fit">
                      <svg viewBox="0 0 40 40" width="44" height="44">
                        <circle cx="20" cy="20" r="17" className="fit-bg" />
                        <circle
                          cx="20"
                          cy="20"
                          r="17"
                          className="fit-fg"
                          strokeDasharray={`${(r.fit / 100) * 2 * Math.PI * 17} 999`}
                          transform="rotate(-90 20 20)"
                        />
                      </svg>
                      <div className="fit-num mono">{r.fit}</div>
                    </div>
                    <div className="match-body">
                      <div className="match-role mono">{r.role.toUpperCase()}</div>
                      <div className="match-name italic">{r.name}</div>
                      <div className="match-meta">
                        <span>{r.price}</span>
                        <span>⋆ {r.rating}</span>
                      </div>
                    </div>
                    <button className="match-pin" type="button">✓</button>
                  </div>
                ))}
              </div>
              <div className="results-footer">
                <span className="mono dim">
                  Загалом ≈ ₴ 474 000 · Економія 18% vs середнього
                </span>
                <a href="/smart-match" className="btn btn-ink">
                  Закріпити команду <span className="arrow">↗</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
