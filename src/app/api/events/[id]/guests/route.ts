import { NextRequest, NextResponse } from "next/server";
import { badRequest, optionalString, parseRsvp, readJson, requireOwnEvent } from "@/lib/planner-api";

export const dynamic = "force-dynamic";

/** Додати гостя до свого заходу. */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const own = await requireOwnEvent(id);
  if ("error" in own) return own.error;

  const body = await readJson(request);
  if (!body) return badRequest("Некоректний запит");

  const name = optionalString(body.name, 120);
  if (!name) return badRequest("Вкажіть ім'я гостя");
  const email = optionalString(body.email, 200);
  if (email && !email.includes("@")) return badRequest("Некоректний email");
  // Без поля rsvp новий гість — «очікує» (null).
  const rsvp = body.rsvp === undefined ? null : parseRsvp(body.rsvp);
  if (rsvp === undefined) return badRequest("Некоректний статус RSVP");

  try {
    const guest = await own.db.guest.create({
      data: {
        eventId: own.eventId,
        name,
        email,
        phone: optionalString(body.phone, 30),
        rsvp,
      },
    });
    return NextResponse.json({ guest }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events/[id]/guests error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
