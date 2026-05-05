import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("🌱 Seeding database...");

  const hash = await bcrypt.hash("password123", 12);

  const clientUser = await db.user.upsert({
    where: { email: "test@eventsphere.com" },
    update: {},
    create: { name: "Тест Користувач", email: "test@eventsphere.com", passwordHash: hash, role: "CLIENT" },
  });

  const v1 = await db.user.upsert({
    where: { email: "crystal@eventsphere.com" },
    update: {},
    create: { name: "Crystal Hall", email: "crystal@eventsphere.com", passwordHash: hash, role: "VENDOR" },
  });
  const v2 = await db.user.upsert({
    where: { email: "artem@eventsphere.com" },
    update: {},
    create: { name: "Артем Мороз", email: "artem@eventsphere.com", passwordHash: hash, role: "VENDOR" },
  });
  const v3 = await db.user.upsert({
    where: { email: "catering@eventsphere.com" },
    update: {},
    create: { name: "Catering Pro", email: "catering@eventsphere.com", passwordHash: hash, role: "VENDOR" },
  });
  const v4 = await db.user.upsert({
    where: { email: "lumiere@eventsphere.com" },
    update: {},
    create: { name: "Студія Lumière", email: "lumiere@eventsphere.com", passwordHash: hash, role: "VENDOR" },
  });
  const v5 = await db.user.upsert({
    where: { email: "flowerbox@eventsphere.com" },
    update: {},
    create: { name: "FlowerBox Studio", email: "flowerbox@eventsphere.com", passwordHash: hash, role: "VENDOR" },
  });

  console.log("✅ Users:", clientUser.email, v1.email, v2.email, v3.email, v4.email, v5.email);

  await db.vendor.upsert({
    where: { userId: v1.id },
    update: {},
    create: {
      userId: v1.id, businessName: "Crystal Hall",
      description: "Преміальний банкетний зал у центрі Києва. Вміщує до 500 гостей.",
      category: "VENUE", city: "Київ", address: "вул. Хрещатик, 22",
      priceFrom: 15000, priceTo: 150000, subscription: "MAX", isVerified: true, rating: 4.9, reviewsCount: 128,
    },
  });
  await db.vendor.upsert({
    where: { userId: v2.id },
    update: {},
    create: {
      userId: v2.id, businessName: "Артем Мороз — Ведучий",
      description: "Професійний ведучий з 10-річним досвідом. Весілля, корпоративи, дні народження.",
      category: "ENTERTAINMENT", city: "Київ", instagram: "artem_morozov",
      priceFrom: 8000, priceTo: 25000, subscription: "PRO", isVerified: true, rating: 5.0, reviewsCount: 87,
    },
  });
  await db.vendor.upsert({
    where: { userId: v3.id },
    update: {},
    create: {
      userId: v3.id, businessName: "Catering Pro",
      description: "Професійний кейтеринг для будь-яких заходів. Широке меню, досвідчені кухарі.",
      category: "CATERING", city: "Харків",
      priceFrom: 450, priceTo: 1500, subscription: "PRO", isVerified: true, rating: 4.8, reviewsCount: 54,
    },
  });
  await db.vendor.upsert({
    where: { userId: v4.id },
    update: {},
    create: {
      userId: v4.id, businessName: "Студія Lumière",
      description: "Команда фотографів та відеографів. Репортажна та постановочна зйомка.",
      category: "PHOTO_VIDEO", city: "Київ", instagram: "lumiere_studio",
      priceFrom: 5000, priceTo: 40000, subscription: "MAX", isVerified: true, rating: 4.9, reviewsCount: 211,
    },
  });
  await db.vendor.upsert({
    where: { userId: v5.id },
    update: {},
    create: {
      userId: v5.id, businessName: "FlowerBox Studio",
      description: "Флористична студія. Букети, арки, оформлення залів.",
      category: "DECOR", city: "Одеса", instagram: "flowerbox_odesa",
      priceFrom: 3000, priceTo: 30000, subscription: "STANDARD", isVerified: false, rating: 4.7, reviewsCount: 93,
    },
  });

  console.log("✅ Vendors created");
  console.log("\n🎉 Done! Login: test@eventsphere.com / password123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
