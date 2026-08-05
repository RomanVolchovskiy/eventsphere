import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/ratelimit";
import { isEventCategory } from "@/lib/categories";

export async function POST(req: NextRequest) {
  // Rate limit: 5 registrations per IP per 15 minutes
  const ip = getClientIp(req);
  const rl = rateLimit(`register:${ip}`, 5, 15 * 60 * 1000);

  if (!rl.success) {
    return NextResponse.json(
      { error: "Забагато спроб. Спробуйте через 15 хвилин." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const body = await req.json();
  const { name, email, password, role, phone, businessName, category, city } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Заповніть усі обов'язкові поля" }, { status: 400 });
  }

  const isVendor = role === "VENDOR";
  if (isVendor) {
    if (!businessName?.trim()) {
      return NextResponse.json({ error: "Вкажіть назву бізнесу" }, { status: 400 });
    }
    if (!isEventCategory(category)) {
      return NextResponse.json({ error: "Оберіть напрям роботи" }, { status: 400 });
    }
    if (!city?.trim()) {
      return NextResponse.json({ error: "Вкажіть місто" }, { status: 400 });
    }
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Пароль мінімум 8 символів" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Невірний формат email" }, { status: 400 });
  }

  const db = getDb();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email вже зайнятий" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: isVendor ? "VENDOR" : "CLIENT",
      phone: phone || null,
    },
  });

  if (isVendor) {
    await db.vendor.create({
      data: {
        userId: user.id,
        businessName: businessName.trim(),
        category,
        city: city.trim(),
      },
    });
  }

  return NextResponse.json(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    { status: 201 }
  );
}
