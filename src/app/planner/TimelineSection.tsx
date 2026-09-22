"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, Circle, Loader2, Plus, Trash2, X } from "lucide-react";
import { plannerInput, usePlannerMutation } from "./use-planner-mutation";

export type TaskItem = {
  id: string;
  title: string;
  /** Уже відформатована на сервері дата («12 бер.») */
  dueLabel: string;
  isDone: boolean;
  overdue: boolean;
};

export function TimelineSection({ eventId, tasks }: { eventId: string; tasks: TaskItem[] }) {
  const { run, busyKey, error, isRefreshing } = usePlannerMutation();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const base = `/api/events/${eventId}/timeline`;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const ok = await run("new", base, {
      method: "POST",
      body: JSON.stringify({ title, dueDate }),
    });
    // Форму лишаємо відкритою — завдання зазвичай додають по кілька.
    if (ok) {
      setTitle("");
      setDueDate("");
    }
  }

  function toggle(t: TaskItem) {
    return run(t.id, `${base}/${t.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isDone: !t.isDone }),
    });
  }

  function remove(t: TaskItem) {
    if (!confirm(`Видалити завдання «${t.title}»?`)) return;
    return run(t.id, `${base}/${t.id}`, { method: "DELETE" });
  }

  return (
    <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--gold)]" />
          Timeline підготовки
        </h2>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="text-[var(--gold)] text-sm hover:underline flex items-center gap-1"
        >
          {adding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {adding ? "Закрити" : "Додати"}
        </button>
      </div>

      {adding && (
        <form onSubmit={add} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            className={plannerInput}
            placeholder="Що потрібно зробити"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            autoFocus
          />
          <input
            className={`${plannerInput} sm:w-40`}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
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

      {tasks.length === 0 ? (
        <p className="text-[var(--text-muted)] text-sm py-6 text-center">
          Завдань підготовки ще немає.
        </p>
      ) : (
        <div className={`space-y-2 transition-opacity ${isRefreshing ? "opacity-60" : ""}`}>
          {tasks.map((task) => {
            const busy = busyKey === task.id;
            return (
              <div
                key={task.id}
                className={`group flex items-center gap-3 p-3 rounded-xl ${task.isDone ? "opacity-50" : ""} hover:bg-[var(--dark)] transition-colors`}
              >
                <button
                  type="button"
                  onClick={() => toggle(task)}
                  disabled={busy}
                  aria-label={task.isDone ? "Позначити невиконаним" : "Позначити виконаним"}
                  className="flex-shrink-0"
                >
                  {busy ? (
                    <Loader2 className="w-5 h-5 text-[var(--gold)] animate-spin" />
                  ) : task.isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle
                      className={`w-5 h-5 ${task.overdue ? "text-red-400" : "text-[var(--text-muted)]"} hover:text-[var(--gold)] transition-colors`}
                    />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.isDone ? "line-through text-[var(--text-muted)]" : "text-white"}`}>
                    {task.title}
                  </p>
                </div>
                <span className={`text-xs flex-shrink-0 ${task.overdue ? "text-red-400" : "text-[var(--text-muted)]"}`}>
                  {task.dueLabel}
                </span>
                <button
                  type="button"
                  onClick={() => remove(task)}
                  disabled={busy}
                  aria-label="Видалити завдання"
                  className="flex-shrink-0 text-[var(--text-muted)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
