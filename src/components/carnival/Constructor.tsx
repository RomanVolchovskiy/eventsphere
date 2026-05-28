"use client";

import { useMemo, useState } from "react";
import { SectionHead } from "./Festive";

type Tone = "magenta" | "gold" | "mint" | "violet" | "cherry" | "peach" | "pink" | "blue";

type PaletteItem = {
  id: string;
  label: string;
  glyph: string;
  tone: Tone;
  price: number;
};

type BoardItem = PaletteItem & { uid: string };

const PALETTE: PaletteItem[] = [
  { id: "loc",   label: "Локація",       glyph: "🏛", tone: "magenta", price: 220000 },
  { id: "decor", label: "Декор & квіти", glyph: "🌸", tone: "cherry",  price: 48000 },
  { id: "photo", label: "Фотограф",      glyph: "📷", tone: "violet",  price: 38000 },
  { id: "video", label: "Відеограф",     glyph: "🎥", tone: "blue",    price: 42000 },
  { id: "cater", label: "Кейтеринг",     glyph: "🍽", tone: "gold",    price: 162000 },
  { id: "band",  label: "Гурт",          glyph: "🎷", tone: "peach",   price: 54000 },
  { id: "dj",    label: "DJ",             glyph: "🎧", tone: "pink",    price: 22000 },
  { id: "host",  label: "Ведучий",       glyph: "🎤", tone: "mint",    price: 28000 },
  { id: "cake",  label: "Торт",           glyph: "🎂", tone: "cherry",  price: 14000 },
  { id: "fwx",   label: "Феєрверк",      glyph: "🎆", tone: "gold",    price: 32000 },
  { id: "trans", label: "Трансфер",      glyph: "🚖", tone: "blue",    price: 12000 },
  { id: "gift",  label: "Подарунки",     glyph: "🎁", tone: "magenta", price: 18000 },
];

const COLUMNS = [
  { id: "pre",   label: "До свята", hint: "запрошення, підготовка, тур" },
  { id: "main",  label: "Сам день", hint: "локація, шоу, частування" },
  { id: "after", label: "Після",    hint: "контент, листівки, пам'ять" },
] as const;

type ColumnId = (typeof COLUMNS)[number]["id"];

const fmt = (n: number) => "₴ " + n.toLocaleString("uk-UA").replace(/,/g, " ");

export default function Constructor() {
  const [board, setBoard] = useState<Record<ColumnId, BoardItem[]>>({ pre: [], main: [], after: [] });
  const [drag, setDrag] = useState<BoardItem | null>(null);
  const [over, setOver] = useState<ColumnId | null>(null);

  const total = useMemo(
    () => Object.values(board).reduce((s, col) => s + col.reduce((a, c) => a + c.price, 0), 0),
    [board],
  );
  const itemCount = Object.values(board).reduce((a, c) => a + c.length, 0);

  const onDragStart = (e: React.DragEvent, item: PaletteItem) => {
    setDrag({
      ...item,
      uid: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    });
    e.dataTransfer.effectAllowed = "copy";
  };
  const onDrop = (e: React.DragEvent, colId: ColumnId) => {
    e.preventDefault();
    if (!drag) return;
    setBoard(b => ({ ...b, [colId]: [...b[colId], drag] }));
    setDrag(null);
    setOver(null);
  };
  const onDragOver = (e: React.DragEvent, colId: ColumnId) => {
    e.preventDefault();
    setOver(colId);
  };
  const onDragLeave = () => setOver(null);
  const remove = (colId: ColumnId, uid: string) =>
    setBoard(b => ({ ...b, [colId]: b[colId].filter(i => i.uid !== uid) }));
  const clearAll = () => setBoard({ pre: [], main: [], after: [] });

  return (
    <section className="constr-sec" id="constructor">
      <SectionHead
        n="03"
        kicker="Конструктор"
        title={
          <>
            Збери своє свято <em>як коробку подарунків</em>
          </>
        }
        sub="Перетягни ритуали у дошку. Платформа автоматично порахує бюджет і збере команду — без зайвих дзвінків."
      />

      <div className="constr-frame">
        <aside className="constr-palette">
          <div className="cp-head">
            <span className="mono">PALETTE · 12 модулів</span>
            <span className="mono dim">drag & drop →</span>
          </div>
          <div className="cp-list">
            {PALETTE.map(p => (
              <div
                key={p.id}
                className={`cp-item t-${p.tone}`}
                draggable
                onDragStart={e => onDragStart(e, p)}
              >
                <span className="cp-glyph">{p.glyph}</span>
                <div className="cp-body">
                  <div className="cp-label">{p.label}</div>
                  <div className="cp-price mono">від {fmt(p.price)}</div>
                </div>
                <span className="cp-grip">⋮⋮</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="constr-board">
          <div className="cb-head">
            <div className="cb-meta">
              <span className="mono">EVENT BOARD · 14.06.2026</span>
              <h3>
                Весілля Софії &amp; Андрія <span className="cb-badge">demo</span>
              </h3>
            </div>
            <div className="cb-totals">
              <div>
                <b>{itemCount}</b>
                <span>модулів</span>
              </div>
              <div>
                <b>{fmt(total)}</b>
                <span>бюджет</span>
              </div>
              <button className="cb-clear" onClick={clearAll} disabled={!itemCount} type="button">
                ↺ очистити
              </button>
            </div>
          </div>

          <div className="cb-cols">
            {COLUMNS.map(col => (
              <div
                key={col.id}
                className={`cb-col ${board[col.id].length ? "has" : ""} ${over === col.id ? "is-over" : ""}`}
                onDragOver={e => onDragOver(e, col.id)}
                onDragLeave={onDragLeave}
                onDrop={e => onDrop(e, col.id)}
              >
                <div className="cb-col-head">
                  <span className="mono">{col.id.toUpperCase()}</span>
                  <h4>{col.label}</h4>
                  <span className="cb-col-hint">{col.hint}</span>
                </div>
                <div className="cb-col-body">
                  {board[col.id].length === 0 && (
                    <div className="cb-empty">
                      <div className="ce-glyph">✦</div>
                      <span>Перетягни сюди</span>
                    </div>
                  )}
                  {board[col.id].map(item => (
                    <div key={item.uid} className={`cb-tile t-${item.tone}`}>
                      <span className="cb-tile-glyph">{item.glyph}</span>
                      <div className="cb-tile-body">
                        <div className="cb-tile-label">{item.label}</div>
                        <div className="cb-tile-price mono">{fmt(item.price)}</div>
                      </div>
                      <button
                        className="cb-tile-x"
                        onClick={() => remove(col.id, item.uid)}
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="cb-footer">
            <span className="mono dim">
              Перетягуй модулі. Платформа перевірить доступність команди.
            </span>
            <button className="btn-pop sm" disabled={!itemCount} type="button">
              <span className="bp-spark">✨</span>
              <span>Згенерувати команду</span>
              <span className="bp-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
