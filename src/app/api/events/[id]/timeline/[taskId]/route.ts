import { NextRequest, NextResponse } from "next/server";
import { badRequest, optionalString, parseDate, readJson, requireOwnEvent } from "@/lib/planner-api";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string; taskId: string }> };

/** Відмітити виконаним / перейменувати / перенести дату. */
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id, taskId } = await params;
  const own = await requireOwnEvent(id);
  if ("error" in own) return own.error;

  const body = await readJson(request);
  if (!body) return badRequest("Некоректний запит");

  const data: { isDone?: boolean; title?: string; dueDate?: Date; description?: string | null } = {};
  if (typeof body.isDone === "boolean") data.isDone = body.isDone;
  if (body.title !== undefined) {
    const title = optionalString(body.title, 200);
    if (!title) return badRequest("Назва не може бути порожньою");
    data.title = title;
  }
  if (body.dueDate !== undefined) {
    const dueDate = parseDate(body.dueDate);
    if (!dueDate) return badRequest("Вкажіть коректну дату");
    data.dueDate = dueDate;
  }
  if (body.description !== undefined) data.description = optionalString(body.description, 1000);
  if (Object.keys(data).length === 0) return badRequest("Нема що змінювати");

  try {
    // updateMany, а не update — щоб eventId був частиною умови, а не лише id.
    const { count } = await own.db.timeline.updateMany({
      where: { id: taskId, eventId: own.eventId },
      data,
    });
    if (count === 0) return NextResponse.json({ error: "Завдання не знайдено" }, { status: 404 });
    const task = await own.db.timeline.findUnique({ where: { id: taskId } });
    return NextResponse.json({ task });
  } catch (error) {
    console.error("PATCH /api/events/[id]/timeline/[taskId] error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id, taskId } = await params;
  const own = await requireOwnEvent(id);
  if ("error" in own) return own.error;

  try {
    const { count } = await own.db.timeline.deleteMany({
      where: { id: taskId, eventId: own.eventId },
    });
    if (count === 0) return NextResponse.json({ error: "Завдання не знайдено" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/events/[id]/timeline/[taskId] error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
