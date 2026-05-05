// Server-only: uses googleapis to create events via OAuth
import { google } from "googleapis";

export async function createGoogleCalendarEvent(
  accessToken: string,
  opts: {
    title: string;
    date: Date;
    durationHours?: number;
    description?: string;
    location?: string;
  }
) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });
  const start = opts.date;
  const end = new Date(start.getTime() + (opts.durationHours ?? 8) * 3600_000);

  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: opts.title,
      description: opts.description,
      location: opts.location,
      start: { dateTime: start.toISOString(), timeZone: "Europe/Kyiv" },
      end: { dateTime: end.toISOString(), timeZone: "Europe/Kyiv" },
    },
  });

  return { id: event.data.id, link: event.data.htmlLink };
}
