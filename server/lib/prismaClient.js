import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import "dotenv/config";

const globalForPrisma = global;

let prisma;

if (process.env.TURSO_AUTH_TOKEN && process.env.DATABASE_URL?.startsWith('libsql:')) {
  const libsql = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const adapter = new PrismaLibSQL({ client: libsql });
  prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
} else {
  prisma = globalForPrisma.prisma || new PrismaClient();
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
export default prisma;
