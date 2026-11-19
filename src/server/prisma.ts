import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@/generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const url = new URL(process.env.DATABASE_URL ?? '');
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: Number(url.searchParams.get('connection_limit') ?? 5),
  });
  return new PrismaClient({ adapter });
}

// Reuse one client across dev hot reloads so the connection pool is not exhausted
export const prisma = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// The frontend identifies records by `_id`, so API responses expose the id under that name
export function withLegacyId<T extends { id: string }>(row: T): Omit<T, 'id'> & { _id: string } {
  const { id, ...rest } = row;
  return { _id: id, ...rest };
}
