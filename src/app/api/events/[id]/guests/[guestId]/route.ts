import { NextRequest, NextResponse } from "next/server";
import { badRequest, optionalString, parseRsvp, readJson, requireOwnEvent } from "@/lib/planner-api";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string; guestId: string }> };

/** Змінити RSVP, контакти або ім'я гостя. */
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id, guestId } = await params;
  const own = await requireOwnEvent(id);
  if ("error" in own) return own.error;

  const body = await readJson(request);
  if (!body) return badRequest("Некоректний запит");

  const data: {
    name?: string; email?: string | null; phone?: string | null;
    rsvp?: string | null; attended?: boolean;
  } = {};
  if (body.name !== undefined) {
    const name = optionalString(body.name, 120);
    if (!name) return badRequest("Ім'я не може бути порожнім");
    data.name = name;
  }
  if (body.email !== undefined) {
    const email = optionalString(body.email, 200);
    if (email && !email.includes("@")) return badRequest("Некоректний email");
    data.email = email;
  }
  if (body.phone !== undefined) data.phone = optionalString(body.phone, 30);
  if (body.rsvp !== undefined) {
    const rsvp = parseRsvp(body.rsvp);
    if (rsvp === undefined) return badRequest("Некоректний статус RSVP");
    data.rsvp = rsvp;
  }
  if (typeof body.attended === "boolean") data.attended = body.attended;
  if (Object.keys(data).length === 0) return badRequest("Нема що змінювати");

  try {
    // updateMany, а не update — щоб eventId був частиною умови, а не лише id.
    const { count } = await own.db.guest.updateMany({
      where: { id: guestId, eventId: own.eventId },
      data,
    });
    if (count === 0) return NextResponse.json({ error: "Гостя не знайдено" }, { status: 404 });
    const guest = await own.db.guest.findUnique({ where: { id: guestId } });
    return NextResponse.json({ guest });
  } catch (error) {
    console.error("PATCH /api/events/[id]/guests/[guestId] error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id, guestId } = await params;
  const own = await requireOwnEvent(id);
  if ("error" in own) return own.error;

  try {
    const { count } = await own.db.guest.deleteMany({
      where: { id: guestId, eventId: own.eventId },
    });
    if (count === 0) return NextResponse.json({ error: "Гостя не знайдено" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/events/[id]/guests/[guestId] error:", error);
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
