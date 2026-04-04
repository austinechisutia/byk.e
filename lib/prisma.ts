import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  var prisma: PrismaClient | undefined;
  var pool: Pool | undefined;
}

const pool = global.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

function createPrismaClient() {
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

function hasCartDelegates(client: PrismaClient | undefined) {
  if (!client) {
    return false;
  }

  const prismaWithCart = client as PrismaClient & {
    cart?: unknown;
    cartItem?: unknown;
  };

  return typeof prismaWithCart.cart !== 'undefined' && typeof prismaWithCart.cartItem !== 'undefined';
}

const prismaClient: PrismaClient = hasCartDelegates(global.prisma)
  ? global.prisma
  : createPrismaClient();

export const prisma = prismaClient;

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
  global.pool = pool;
}
