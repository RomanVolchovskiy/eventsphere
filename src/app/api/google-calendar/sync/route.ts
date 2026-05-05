import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createGoogleCalendarEvent } from "@/lib/google-calendar-api";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = session.googleAccessToken;
  if (!accessToken) {
    return NextResponse.json(
      { error: "Google Calendar не підключено. Увійдіть через Google." },
      { status: 403 }
    );
  }

  const { title, date, description, location, durationHours } = await request.json();

  if (!title || !date) {
    return NextResponse.json({ error: "title і date обов'язкові" }, { status: 400 });
  }

  const result = await createGoogleCalendarEvent(accessToken, {
    title,
    date: new Date(date),
    description,
    location,
    durationHours: durationHours ?? 8,
  });

  return NextResponse.json(result);
}
