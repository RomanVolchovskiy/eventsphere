import Link from "next/link";
import { CheckCircle2, ArrowRight, Calendar, ExternalLink } from "lucide-react";
import { getDb } from "@/lib/db";
import { addToGoogleCalendarUrl } from "@/lib/google-calendar";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { bookingId?: string; session_id?: string };
}) {
  let booking: { date: Date; vendor: { businessName: string; city: string } } | null = null;

  if (searchParams.bookingId) {
    try {
      const db = getDb();
      booking = await db.booking.findUnique({
        where: { id: searchParams.bookingId },
        select: {
          date: true,
          vendor: { select: { businessName: true, city: true } },
        },
      });
    } catch {
      // ignore DB errors on this page
    }
  }

  const calendarUrl = booking
    ? addToGoogleCalendarUrl({
        title: `Захід: ${booking.vendor.businessName}`,
        date: booking.date,
        location: booking.vendor.city,
        description: `Бронювання ЄСвято · ID: ${searchParams.bookingId}`,
      })
    : null;

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Оплату отримано!</h1>
        <p className="text-[var(--text-muted)] mb-2">
          Кошти надійно заброньовані в системі Escrow.
        </p>
        <p className="text-[var(--text-muted)] text-sm mb-8">
          Виконавець отримає підтвердження і зв&apos;яжеться з вами найближчим часом.
          Кошти перейдуть виконавцю після підтвердження якості послуги.
        </p>

        {booking && (
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[var(--text-muted)] text-xs mb-1">Виконавець</p>
                <p className="text-white font-medium text-sm">{booking.vendor.businessName}</p>
                <p className="text-[var(--text-muted)] text-xs mt-1">
                  {new Date(booking.date).toLocaleDateString("uk-UA", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>
              <p className="text-[var(--text-muted)] text-xs font-mono mt-0.5">
                #{searchParams.bookingId?.slice(-8)}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {calendarUrl && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white/10 border border-white/20 text-white font-medium py-3 rounded-xl hover:bg-white/15 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Додати до Google Calendar
            </a>
          )}
          <Link
            href="/dashboard"
            className="w-full bg-[var(--gold)] text-black font-semibold py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Переглянути бронювання
          </Link>
          <Link
            href="/catalog"
            className="w-full border border-[var(--dark-border)] text-[var(--text-muted)] py-3 rounded-xl hover:border-[var(--gold)] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
          >
            Продовжити пошук
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
