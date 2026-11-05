/**
 * Idempotent seed for the Lab 2 test stand: runs the regular dev seed
 * only when the catalog is empty, so `docker compose up` can be repeated.
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { spawnSync } from 'node:child_process';

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  });
  const prisma = new PrismaClient({ adapter });
  const products = await prisma.product.count();
  await prisma.$disconnect();

  if (products > 0) {
    console.log(`[lab2.seed] catalog already has ${products} products — skip`);
    return 0;
  }
  console.log('[lab2.seed] empty catalog — running prisma.seed.ts');
  const run = spawnSync('bun', ['src/infrastructure/prisma/prisma.seed.ts'], {
    stdio: 'inherit',
  });
  return run.status ?? 1;
}

main().then(code => process.exit(code));
