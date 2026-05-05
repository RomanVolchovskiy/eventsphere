// Client-safe: generates a Google Calendar "Add event" URL (no OAuth needed)
export function addToGoogleCalendarUrl(opts: {
  title: string;
  date: Date;
  durationHours?: number;
  description?: string;
  location?: string;
}): string {
  const start = opts.date;
  const end = new Date(start.getTime() + (opts.durationHours ?? 8) * 3600_000);

  function fmt(d: Date) {
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    ...(opts.description ? { details: opts.description } : {}),
    ...(opts.location ? { location: opts.location } : {}),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
