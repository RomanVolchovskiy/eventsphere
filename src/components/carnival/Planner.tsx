"use client";

import { useState } from "react";
import { SectionHead } from "./Festive";

const CITY_EVENTS = [
  { city: "Київ",       events: 142, hot: true },
  { city: "Львів",       events: 88,  hot: true },
  { city: "Одеса",       events: 64, hot: false },
  { city: "Харків",      events: 42, hot: false },
  { city: "Дніпро",      events: 38, hot: false },
  { city: "Івано-Фр.",  events: 24, hot: false },
  { city: "Чернівці",   events: 18, hot: false },
  { city: "Запоріжжя",  events: 21, hot: false },
];

const FEED = [
  { time: "18:00", title: "Корпоратив Monobank",  venue: "Forest Hall",     tag: "200 гостей" },
  { time: "19:30", title: "Весілля С&А",           venue: "Vila Magnolia",   tag: "120 гостей" },
  { time: "20:00", title: "Brass & Velvet · live", venue: "Underhub",        tag: "DJ-сет" },
  { time: "21:00", title: "Day-by-day pop-up",     venue: "Atelier Vy",      tag: "запис" },
];

export default function Planner() {
  const [active, setActive] = useState(0);
  const c = CITY_EVENTS[active];

  return (
    <section className="planner-sec" id="planner">
      <SectionHead
        n="04"
        kicker="Жива мапа"
        title={
          <>
            Україна <em>святкує</em> просто зараз
          </>
        }
        sub="142 події у Києві сьогодні. 88 у Львові. Підключайся до пульсу країни."
      />
      <div className="planner-wrap">
        <div className="planner-grid">
          {CITY_EVENTS.map((c, i) => (
            <button
              key={c.city}
              className={`pl-cell ${active === i ? "is-on" : ""} ${c.hot ? "is-hot" : ""}`}
              onClick={() => setActive(i)}
              type="button"
            >
              <div className="pl-pulse" />
              <div className="pl-spark">✦</div>
              <div className="pl-num">{c.events}</div>
              <div className="pl-city">{c.city}</div>
              <div className="pl-meta mono">подій сьогодні</div>
            </button>
          ))}
        </div>
        <aside className="planner-side">
          <div className="ps-head">
            <span className="mono dim">⊹ {c.city.toUpperCase()} · сьогодні</span>
            <h3>
              {c.events} подій <em>зараз</em>
            </h3>
          </div>
          <div className="ps-feed">
            {FEED.map((e, i) => (
              <div key={i} className="ps-row">
                <span className="ps-time mono">{e.time}</span>
                <div className="ps-body">
                  <div className="ps-title">{e.title}</div>
                  <div className="ps-venue">{e.venue}</div>
                </div>
                <span className="ps-tag mono">{e.tag}</span>
              </div>
            ))}
          </div>
          <a href="#" className="ps-cta">
            Усі події у {c.city} <span>↗</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
