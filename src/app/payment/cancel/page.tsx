import Link from "next/link";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { getDb } from "@/lib/db";

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: { bookingId?: string };
}) {
  // Cancel the booking if payment was cancelled
  if (searchParams.bookingId) {
    try {
      const db = getDb();
      await db.booking.update({
        where: { id: searchParams.bookingId },
        data: { status: "CANCELLED" },
      });
    } catch {
      // booking might not exist
    }
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-red-400/10 border border-red-400/30 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Оплату скасовано</h1>
        <p className="text-[var(--text-muted)] mb-8">
          Кошти не були списані. Бронювання скасовано.
          Ви можете спробувати знову або обрати іншого виконавця.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/catalog"
            className="w-full bg-[var(--gold)] text-black font-semibold py-3 rounded-xl hover:bg-[var(--gold-light)] transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Спробувати ще раз
          </Link>
          <Link
            href="/"
            className="w-full border border-[var(--dark-border)] text-[var(--text-muted)] py-3 rounded-xl hover:border-[var(--gold)] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            На головну
          </Link>
        </div>
      </div>
    </div>
  );
}
