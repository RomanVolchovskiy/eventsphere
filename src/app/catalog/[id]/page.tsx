import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Star, BadgeCheck, Calendar, ChevronLeft,
  Globe, Phone, Clock, Users, MessageSquare, Heart,
  Share2, CheckCircle2, Sparkles, Instagram,
} from "lucide-react";
import BookingPanel from "./BookingPanel";
import { getDb } from "@/lib/db";

const CATEGORY_LABELS: Record<string, string> = {
  VENUE: "Локація",
  ENTERTAINMENT: "Шоу-програма",
  CATERING: "Кейтеринг",
  PHOTO_VIDEO: "Фото/Відео",
  DECOR: "Декор",
};

const tagsByCategory: Record<string, string[]> = {
  VENUE: ["Весілля", "Корпоратив", "Банкет"],
  ENTERTAINMENT: ["Ведучий", "DJ", "Музика"],
  CATERING: ["Фуршет", "Банкет", "Кейтеринг"],
  PHOTO_VIDEO: ["Фотозйомка", "Відеозйомка", "360°"],
  DECOR: ["Квіти", "Декор", "Оформлення"],
};

export default async function VendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();

  const vendor = await db.vendor.findUnique({
    where: { id },
    include: {
      services: { where: { isActive: true } },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      availability: {
        where: { isBooked: true },
        select: { date: true },
      },
    },
  });

  if (!vendor) notFound();

  const bookedDates = vendor.availability.map((a) =>
    a.date.toISOString().split("T")[0]
  );

  const tags = tagsByCategory[vendor.category] ?? [];
  const categoryLabel = CATEGORY_LABELS[vendor.category] ?? vendor.category;

  return (
    <div className="pt-16 min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--dark-border)] bg-[var(--dark-card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm">
          <Link
            href="/catalog"
            className="flex items-center gap-1 text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Каталог
          </Link>
          <span className="text-[var(--dark-border)]">/</span>
          <span className="text-white">{vendor.businessName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Photo gallery */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-80 rounded-2xl overflow-hidden">
              <div className="col-span-2 row-span-2 bg-gradient-to-br from-[var(--dark-card)] to-[var(--dark-border)] flex items-center justify-center relative group cursor-pointer">
                {vendor.photos[0] ? (
                  <img src={vendor.photos[0]} alt={vendor.businessName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl opacity-20">🏛️</span>
                )}
                {vendor.panoramaUrl && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-[var(--gold)] text-sm px-3 py-1.5 rounded-full border border-[var(--gold)]/30 backdrop-blur-sm">
                      Переглянути 360°
                    </span>
                  </div>
                )}
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-[var(--dark-card)] to-[var(--dark-border)] flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer transition-opacity overflow-hidden"
                >
                  {vendor.photos[i] ? (
                    <img src={vendor.photos[i]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl opacity-30">🏛️</span>
                  )}
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-white">{vendor.businessName}</h1>
                  {vendor.isVerified && (
                    <BadgeCheck className="w-5 h-5 text-green-400" />
                  )}
                  {vendor.subscription === "MAX" && (
                    <span className="text-xs bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20 px-2 py-0.5 rounded-full">
                      MAX
                    </span>
                  )}
                  {vendor.subscription === "PRO" && (
                    <span className="text-xs bg-blue-400/10 text-blue-400 border border-blue-400/20 px-2 py-0.5 rounded-full">
                      PRO
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span className="text-[var(--gold)] font-medium">{categoryLabel}</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {vendor.city}
                    {vendor.address && `, ${vendor.address}`}
                  </div>
                  {vendor.reviewsCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
                      <span className="text-white font-medium">{vendor.rating.toFixed(1)}</span>
                      <span>({vendor.reviewsCount} відгуків)</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="w-9 h-9 border border-[var(--dark-border)] rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 border border-[var(--dark-border)] rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[var(--dark-card)] border border-[var(--dark-border)] text-[var(--text-muted)] text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {vendor.description && (
              <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-3">Про виконавця</h2>
                <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                  {vendor.description}
                </p>
              </div>
            )}

            {/* Info grid */}
            <div className="grid sm:grid-cols-3 gap-3">
              {vendor.website && (
                <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-[var(--gold)]" />
                    <span className="text-[var(--text-muted)] text-xs">Сайт</span>
                  </div>
                  <a href={`https://${vendor.website}`} target="_blank" rel="noopener noreferrer"
                    className="text-white text-sm font-medium hover:text-[var(--gold)] transition-colors">
                    {vendor.website}
                  </a>
                </div>
              )}
              {vendor.instagram && (
                <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[var(--gold)] text-sm">📸</span>
                    <span className="text-[var(--text-muted)] text-xs">Instagram</span>
                  </div>
                  <p className="text-white text-sm font-medium">{vendor.instagram}</p>
                </div>
              )}
              <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-[var(--gold)]" />
                  <span className="text-[var(--text-muted)] text-xs">Місто</span>
                </div>
                <p className="text-white text-sm font-medium">{vendor.city}</p>
              </div>
            </div>

            {/* Services */}
            {vendor.services.length > 0 && (
              <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Послуги та ціни</h2>
                <div className="space-y-2">
                  {vendor.services.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between py-3 border-b border-[var(--dark-border)] last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[var(--gold)] flex-shrink-0" />
                        <div>
                          <span className="text-sm text-[var(--text-muted)]">{s.name}</span>
                          {s.description && (
                            <p className="text-xs text-[var(--text-muted)]/60 mt-0.5">{s.description}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-white text-sm font-medium flex-shrink-0 ml-4">
                        {s.price.toLocaleString("uk-UA")} ₴
                        {s.duration && (
                          <span className="text-[var(--text-muted)] font-normal"> / {s.duration} хв</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {vendor.reviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[var(--gold)]" />
                    Відгуки ({vendor.reviewsCount})
                  </h2>
                  {vendor.reviewsCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-[var(--gold)] fill-[var(--gold)]" />
                      <span className="text-white font-bold text-lg">{vendor.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {vendor.reviews.map((r) => (
                    <div
                      key={r.id}
                      className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-sm font-semibold text-[var(--gold)]">
                            {(r.user.name ?? "?").charAt(0)}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{r.user.name ?? "Анонім"}</p>
                            <p className="text-[var(--text-muted)] text-xs">
                              {new Date(r.createdAt).toLocaleDateString("uk-UA", {
                                day: "numeric", month: "long", year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 text-[var(--gold)] fill-[var(--gold)]" />
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed">{r.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {vendor.reviews.length === 0 && (
              <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 text-center">
                <MessageSquare className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-40" />
                <p className="text-[var(--text-muted)] text-sm">Відгуків поки немає. Будьте першим!</p>
              </div>
            )}
          </div>

          {/* RIGHT: booking panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingPanel
                vendorId={vendor.id}
                priceFrom={vendor.priceFrom ?? 0}
                priceTo={vendor.priceTo ?? 0}
                bookedDates={bookedDates}
                vendorName={vendor.businessName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
