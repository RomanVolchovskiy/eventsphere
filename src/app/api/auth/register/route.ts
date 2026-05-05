import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, role, phone, businessName } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Заповніть усі обов'язкові поля" }, { status: 400 });
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
      role: role === "VENDOR" ? "VENDOR" : "CLIENT",
      phone: phone || null,
    },
  });

  if (role === "VENDOR" && businessName) {
    await db.vendor.create({
      data: {
        userId: user.id,
        businessName,
        category: "VENUE",
        city: "",
      },
    });
  }

  return NextResponse.json(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    { status: 201 }
  );
}
