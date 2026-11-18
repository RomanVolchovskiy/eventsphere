import type { PrismaClient } from "../generated/prisma/client";

let _db: PrismaClient | null = null;

export function getDb(): PrismaClient {
  if (_db) return _db;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient: PrismaClientClass } = require("../generated/prisma/client");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require("@prisma/adapter-pg");
  // Vercel Supabase integration provides POSTGRES_URL; uselibpqcompat keeps sslmode=require without strict CA check
  const raw = (process.env.POSTGRES_URL ?? process.env.DATABASE_URL)!;
  const connectionString = raw.includes("sslmode=") && !raw.includes("uselibpqcompat") ? `${raw}&uselibpqcompat=true` : raw;
  _db = new PrismaClientClass({
    adapter: new PrismaPg({ connectionString }),
  }) as PrismaClient;
  return _db;
}
