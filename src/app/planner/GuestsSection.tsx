"use client";

import { useState } from "react";
import { Loader2, Plus, Trash2, Users, X } from "lucide-react";
import { plannerInput, usePlannerMutation } from "./use-planner-mutation";

export type GuestItem = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvp: "yes" | "no" | null;
};

const RSVP: { value: "pending" | "yes" | "no"; label: string; color: string }[] = [
  { value: "pending", label: "Очікує", color: "text-yellow-400 bg-yellow-400/10" },
  { value: "yes", label: "Підтвердив", color: "text-green-400 bg-green-400/10" },
  { value: "no", label: "Відмовив", color: "text-red-400 bg-red-400/10" },
];

export function GuestsSection({ eventId, guests }: { eventId: string; guests: GuestItem[] }) {
  const { run, busyKey, error, isRefreshing } = usePlannerMutation();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const base = `/api/events/${eventId}/guests`;
  const confirmed = guests.filter((g) => g.rsvp === "yes").length;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const ok = await run("new", base, { method: "POST", body: JSON.stringify(form) });
    // Форму лишаємо відкритою — гостей додають списком.
    if (ok) setForm({ name: "", phone: "", email: "" });
  }

  function setRsvp(g: GuestItem, value: string) {
    return run(g.id, `${base}/${g.id}`, {
      method: "PATCH",
      body: JSON.stringify({ rsvp: value === "pending" ? null : value }),
    });
  }

  function remove(g: GuestItem) {
    if (!confirm(`Видалити гостя «${g.name}» зі списку?`)) return;
    return run(g.id, `${base}/${g.id}`, { method: "DELETE" });
  }

  return (
    <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-5 gap-4">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--gold)]" />
          Список гостей
        </h2>
        <div className="flex items-center gap-4">
          {guests.length > 0 && (
            <span className="text-[var(--text-muted)] text-sm hidden sm:inline">
              {confirmed} з {guests.length} підтвердили
            </span>
          )}
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="text-[var(--gold)] text-sm hover:underline flex items-center gap-1"
          >
            {adding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {adding ? "Закрити" : "Додати"}
          </button>
        </div>
      </div>

      {adding && (
        <form onSubmit={add} className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-2 mb-4">
          <input
            className={plannerInput}
            placeholder="Ім'я гостя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            maxLength={120}
            autoFocus
          />
          <input
            className={`${plannerInput} sm:w-44`}
            type="tel"
            placeholder="Телефон"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            maxLength={30}
          />
          <input
            className={`${plannerInput} sm:w-52`}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            maxLength={200}
          />
          <button
            type="submit"
            disabled={busyKey === "new"}
            className="inline-flex items-center justify-center gap-2 bg-[var(--gold)] text-black font-medium px-4 py-2 rounded-xl hover:bg-[var(--gold-light)] transition-colors text-sm disabled:opacity-60 whitespace-nowrap"
          >
            {busyKey === "new" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Додати
          </button>
        </form>
      )}

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

      {guests.length === 0 ? (
        <p className="text-[var(--text-muted)] text-sm py-6 text-center">
          Список гостей порожній.
        </p>
      ) : (
        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-2 transition-opacity ${isRefreshing ? "opacity-60" : ""}`}>
          {guests.map((g) => {
            const busy = busyKey === g.id;
            const current = RSVP.find((r) => r.value === (g.rsvp ?? "pending")) ?? RSVP[0];
            const contact = g.phone ?? g.email;
            return (
              <div
                key={g.id}
                className="group flex items-center justify-between gap-2 p-3 rounded-xl hover:bg-[var(--dark)] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[var(--dark)] flex items-center justify-center text-xs font-semibold text-[var(--gold)] flex-shrink-0">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : g.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate">{g.name}</p>
                    {contact && (
                      <p className="text-[var(--text-muted)] text-xs truncate">{contact}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* RSVP міняє сам організатор — гість без акаунта відповідає йому словами. */}
                  <select
                    value={current.value}
                    onChange={(e) => setRsvp(g, e.target.value)}
                    disabled={busy}
                    aria-label={`RSVP: ${g.name}`}
                    className={`text-xs px-2 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--gold)] appearance-none ${current.color}`}
                  >
                    {RSVP.map((r) => (
                      <option key={r.value} value={r.value} className="bg-[var(--dark-card)] text-white">
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => remove(g)}
                    disabled={busy}
                    aria-label="Видалити гостя"
                    className="text-[var(--text-muted)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
