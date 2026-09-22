import { NextRequest, NextResponse } from "next/server";
import { badRequest, optionalString, parseDate, readJson, requireOwnEvent } from "@/lib/planner-api";

export const dynamic = "force-dynamic";

/** Додати завдання підготовки до свого заходу. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const own = await requireOwnEvent(id);
  if ("error" in own) return own.error;

  const body = await readJson(request);
  if (!body) return badRequest("Некоректний запит");

  const title = optionalString(body.title, 200);
  if (!title) return badRequest("Вкажіть назву завдання");
  const dueDate = parseDate(body.dueDate);
  if (!dueDate) return badRequest("Вкажіть коректну дату");

  try {
    const task = await own.db.timeline.create({
      data: {
        eventId: own.eventId,
        title,
        dueDate,
        description: optionalString(body.description, 1000),
      },
    });
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events/[id]/timeline error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
