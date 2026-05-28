"use client";

import { useState } from "react";
import { Calendar, Users, MessageSquare, Shield, ArrowRight, CreditCard, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BookingPanelProps {
  vendorId: string;
  priceFrom: number;
  priceTo: number;
  bookedDates: string[];
  vendorName: string;
}

const MONTHS = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень",
];

function MiniCalendar({ bookedDates, selected, onSelect }: {
  bookedDates: string[];
  selected: string | null;
  onSelect: (d: string) => void;
}) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  function pad(n: number) { return n.toString().padStart(2, "0"); }
  function prev() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const cells = Array.from({ length: offset + daysInMonth }, (_, i) =>
    i < offset ? null : i - offset + 1
  );

  return (
    <div className="bg-[var(--dark)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="text-[var(--text-muted)] hover:text-white p-1 rounded transition-colors">‹</button>
        <span className="text-white text-sm font-medium">{MONTHS[month]} {year}</span>
        <button onClick={next} className="text-[var(--text-muted)] hover:text-white p-1 rounded transition-colors">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map(d => (
          <div key={d} className="text-center text-[var(--text-muted)] text-xs py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
          const isBooked = bookedDates.includes(dateStr);
          const isPast = new Date(dateStr) < today;
          const isSelected = selected === dateStr;
          return (
            <button
              key={i}
              disabled={isBooked || isPast}
              onClick={() => onSelect(dateStr)}
              className={`text-xs py-1.5 rounded-lg transition-all ${
                isSelected
                  ? "bg-[var(--gold)] text-black font-semibold"
                  : isBooked
                  ? "bg-red-500/10 text-red-400/50 cursor-not-allowed line-through"
                  : isPast
                  ? "text-[var(--dark-border)] cursor-not-allowed"
                  : "text-white hover:bg-[var(--gold)]/20 hover:text-[var(--gold)]"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3 pt-3 border-t border-[var(--dark-border)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-[var(--gold)]" />
          <span className="text-[var(--text-muted)] text-xs">Обрано</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-red-500/20" />
          <span className="text-[var(--text-muted)] text-xs">Зайнято</span>
        </div>
      </div>
    </div>
  );
}

export default function BookingPanel({ vendorId, priceFrom, priceTo, bookedDates, vendorName }: BookingPanelProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [guests, setGuests] = useState(50);
  const [showModal, setShowModal] = useState(false);
  const [eventType, setEventType] = useState("Весілля");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!selectedDate) {
      setError("Будь ласка, оберіть дату");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId,
          date: selectedDate,
          notes,
          eventType,
          totalPrice: priceFrom,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Помилка оплати");
        setLoading(false);
        return;
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError("Помилка під час обробки запиту");
      setLoading(false);
      console.error("Payment error:", err);
    }
  }

  return (
    <>
      <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 space-y-5">
        {/* Price */}
        <div>
          <p className="text-[var(--text-muted)] text-xs mb-1">Вартість оренди</p>
          <p className="text-2xl font-bold text-white">
            {priceFrom.toLocaleString("uk-UA")}
            <span className="text-[var(--text-muted)] text-base font-normal">
              {" "}– {priceTo.toLocaleString("uk-UA")} ₴
            </span>
          </p>
        </div>

        {/* Calendar */}
        <div>
          <p className="text-sm text-[var(--text-muted)] flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-[var(--gold)]" />
            Оберіть дату заходу
          </p>
          <MiniCalendar
            bookedDates={bookedDates}
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
          {selectedDate && (
            <p className="text-[var(--gold)] text-xs text-center mt-2">
              Обрано: {new Date(selectedDate).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>

        {/* Guests count */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-[var(--text-muted)] flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--gold)]" />
              Кількість гостей
            </p>
            <span className="text-white font-semibold">{guests}</span>
          </div>
          <input
            type="range" min={10} max={500} step={10} value={guests}
            onChange={e => setGuests(Number(e.target.value))}
            className="w-full accent-[var(--gold)]"
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
            <span>10</span><span>500</span>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => selectedDate ? setShowModal(true) : null}
          disabled={!selectedDate}
          className="w-full bg-[var(--gold)] disabled:bg-[var(--dark-border)] disabled:text-[var(--text-muted)] text-black font-semibold py-3.5 rounded-xl hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          Забронювати
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => router.push(session ? `/messages?vendor=${vendorId}` : `/login`)}
          className="w-full border border-[var(--dark-border)] text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          Написати повідомлення
        </button>

        {/* Trust */}
        <div className="border-t border-[var(--dark-border)] pt-4 flex items-start gap-3">
          <Shield className="w-4 h-4 text-[var(--gold)] flex-shrink-0 mt-0.5" />
          <p className="text-[var(--text-muted)] text-xs leading-relaxed">
            <span className="text-white">Безпечна угода (Escrow).</span> Кошти переходять
            виконавцю лише після підтвердження якості послуги.
          </p>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-7 w-full max-w-md">
            <h3 className="text-white font-semibold text-lg mb-1">Підтвердження бронювання</h3>
            <p className="text-[var(--text-muted)] text-sm mb-6">
              {vendorName} ·{" "}
              {selectedDate && new Date(selectedDate).toLocaleDateString("uk-UA", {
                day: "numeric", month: "long", year: "numeric",
              })}{" "}
              · {guests} гостей
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Тип заходу</label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--gold)] text-sm"
                >
                  <option>Весілля</option>
                  <option>Корпоратив</option>
                  <option>День народження</option>
                  <option>Ювілей</option>
                  <option>Інше</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Побажання (необов&apos;язково)</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Опишіть деталі вашого заходу..."
                  className="w-full bg-[var(--dark)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--gold)] text-sm resize-none"
                />
              </div>

              {/* Price summary */}
              <div className="bg-[var(--dark)] rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-muted)]">Базова вартість</span>
                  <span className="text-white">{priceFrom.toLocaleString("uk")} ₴</span>
                </div>
                <div className="flex justify-between text-sm border-t border-[var(--dark-border)] pt-2 mt-2">
                  <span className="text-white font-medium">До сплати</span>
                  <span className="text-[var(--gold)] font-bold">{priceFrom.toLocaleString("uk")} ₴</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 border border-[var(--dark-border)] text-[var(--text-muted)] py-3 rounded-xl hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors text-sm"
              >
                Скасувати
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 bg-[var(--gold)] text-black font-semibold py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <><CreditCard className="w-4 h-4" /> Оплатити</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
