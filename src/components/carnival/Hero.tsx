"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "./Confetti";
import { MarqueeFrame, Firework, Balloon, Ticker } from "./Festive";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-spot" />
      <div className="hero-curtain l" />
      <div className="hero-curtain r" />
      <Confetti density={90} />
      <Firework x={12} y={22} hue="#FFC857" delay={0} size={120} />
      <Firework x={86} y={18} hue="#FF3D80" delay={0.7} size={100} />
      <Firework x={74} y={66} hue="#4DE0B5" delay={1.4} size={90} />
      <Firework x={20} y={70} hue="#7C5BFF" delay={2.1} size={80} />

      <div className="hero-balloons">
        <Balloon color="#FF3D80" x={6} delay={0} size={72} />
        <Balloon color="#FFC857" x={88} delay={0.6} size={86} />
        <Balloon color="#4DE0B5" x={92} delay={1.2} size={62} />
        <Balloon color="#7C5BFF" x={4} delay={1.8} size={66} />
      </div>

      <div className="hero-bar">
        <span className="mono">⊹ KYIV · СВЯТКУЄМО ЩОДНЯ</span>
        <LiveClock />
        <span className="mono">v.8.0 — carnival edition</span>
      </div>

      <MarqueeFrame>
        <div className="hero-inner">
          <div className="hero-pill">
            <span className="cake-emoji">🎉</span>
            <span>Платформа святкування 2026</span>
            <span className="dot pink" />
          </div>

          <h1 className="mega">
            <span className="line">Хай</span>
            <span className="line">
              <span className="grad">святкують</span>
            </span>
            <span className="line">всі.</span>
          </h1>

          <p className="hero-sub">
            Від ранкової кави з квітами — до фейерверків над Дніпром. EventSphere збирає всі ритуали радості в одне місце: 2 400+ виконавців, AI-підбір команди, конструктор події та живу карту свят України.
          </p>

          <div className="hero-cta">
            <Link href="#constructor" className="btn-pop">
              <span className="bp-spark">✨</span>
              <span>Зібрати свято</span>
              <span className="bp-arrow">→</span>
            </Link>
            <Link href="/smart-match" className="btn-line">
              <span>Підібрати команду</span>
              <span className="dim">за 60 сек</span>
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <b>2 400+</b>
              <span>виконавців</span>
            </div>
            <div className="div" />
            <div>
              <b>18 K</b>
              <span>заходів /рік</span>
            </div>
            <div className="div" />
            <div>
              <b>4.9 ★</b>
              <span>рейтинг</span>
            </div>
            <div className="div" />
            <div>
              <b>22</b>
              <span>міста</span>
            </div>
          </div>
        </div>
      </MarqueeFrame>

      <Ticker />
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
    return (
      <span className="mono live">
        <i className="dot" /> LIVE · 2 412 ВИКОНАВЦІВ
      </span>
    );
  }
  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  return (
    <span className="mono live">
      <i className="dot" /> LIVE · 2 412 ВИКОНАВЦІВ · {hh}:{mm}
    </span>
  );
}
