import { PrismaClient } from "../generated/prisma/client";
import { normalizeDatabaseUrl } from "./database-url";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const url = normalizeDatabaseUrl(process.env.DATABASE_URL);
  return new PrismaClient(url ? { datasources: { db: { url } } } : undefined);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
