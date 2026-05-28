"use client";

import { useEffect, useState } from "react";

const TICKER = [
  "→ Микола та Софія забронювали Вілла Тиша на 18 червня",
  "→ Studio Polonyna відкрили 12 нових слотів на серпень",
  "→ Hum Catering · меню «Поділля» оновлено",
  "→ Smart Match підібрав 8 команд за останню хвилину",
  "→ Olha Tkach · 3 нові відгуки 5★",
  "→ Brass & Velvet грають у Львові 22 червня",
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>

      <div className="hero-top">
        <span className="mono dim">[ 49°50′N · 24°00′E · Україна, 2026 ]</span>
        <LiveClock />
      </div>

      <div className="hero-body">
        <h1 className="display">
          <span className="display-line">Атлас</span>
          <span className="display-line italic">святкування</span>
          <span className="display-line trail">&amp; буднів.</span>
        </h1>

        <div className="hero-aside">
          <p className="lead">
            Від ранкової кави до весілля мрії — одна екосистема для всіх дрібниць, що складаються у свято.
          </p>
          <div className="hero-cta">
            <a href="#compass" className="btn btn-ink">
              Знайти виконавця <span className="arrow">↗</span>
            </a>
            <a href="#smart" className="btn btn-ghost">
              Спланувати захід
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <b>2 400+</b>
              <span>виконавців</span>
            </div>
            <div>
              <b>18 000+</b>
              <span>заходів</span>
            </div>
            <div>
              <b>4.9</b>
              <span>рейтинг</span>
            </div>
          </div>
        </div>
      </div>

      <Ticker items={TICKER} />
    </section>
  );
}

function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!time) {
    return <span className="mono dim">ЗАРАЗ У МЕРЕЖІ · ––:––:––</span>;
  }
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");
  return (
    <span className="mono dim">
      ЗАРАЗ У МЕРЕЖІ · {hh}:{mm}
      <span className="blink">:</span>
      {ss}
    </span>
  );
}

function Ticker({ items }: { items: string[] }) {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="ticker" aria-hidden="true">
      <span className="ticker-tag mono">LIVE</span>
      <div className="ticker-track">
        {repeated.map((s, i) => (
          <span key={i} className="ticker-item">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
