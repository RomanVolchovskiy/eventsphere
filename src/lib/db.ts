import type { PrismaClient } from "../generated/prisma/client";

let _db: PrismaClient | null = null;

export function getDb(): PrismaClient {
  if (_db) return _db;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient: PrismaClientClass } = require("../generated/prisma/client");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require("@prisma/adapter-pg");
  _db = new PrismaClientClass({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  }) as PrismaClient;
  return _db;
}
