import { PrismaPg } from '@prisma/adapter-pg';
import { BundleType, PrismaClient, ProductStatus, Role } from '@prisma/client';
import { hashPassword } from 'better-auth/crypto';
import 'dotenv/config';
import { nanoid } from 'nanoid';

import { generateAbbreviation } from '@/common/utils';
import { generateSlug } from '@/core/lib/slugify.lib';

import { SmartSkuService } from '../smart-sku/smart-sku.service';

const db_url = process.env.DATABASE_URL;
console.log('DEBUG, prisma seed db_url:', db_url);

const adapter = new PrismaPg({ connectionString: db_url as string });
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────

const SPACE_TYPES = [
  { title: 'Restaurant' },
  { title: 'Cafe' },
  { title: 'Office' },
  { title: 'Hotel' },
  { title: 'Coworking' },
  { title: 'Bar' },
  { title: 'Retail' },
];

const CATEGORIES = [
  { title: 'Seating' },
  { title: 'Tables & Desks' },
  { title: 'Storage' },
  { title: 'Lounge' },
  { title: 'Dining' },
  { title: 'Outdoor' },
  { title: 'Lighting' },
  { title: 'Industrial' },
];

const USERS = [
  {
    name: 'Admin User',
    email: 'admin@gyp6.sale',
    password: 'Password123',
    role: Role.ADMIN,
    companyName: 'GYP6 Admin',
    taxCode: '00000000',
    specialisations: ['Coworking'],
  },
  {
    name: 'Supplier One',
    email: 'supplier@gyp6.sale',
    password: 'Password123',
    role: Role.SUPPLIER,
    companyName: 'Furniture UA',
    taxCode: '12345678',
    specialisations: ['Restaurant'],
  },
  {
    name: 'Designer One',
    email: 'designer@gyp6.sale',
    password: 'Password123',
    role: Role.DESIGNER,
    companyName: 'Design Studio',
    taxCode: '87654321',
    specialisations: ['Interior Design', 'Architecture'],
  },
  {
    name: 'Retailer One',
    email: 'retailer@gyp6.sale',
    password: 'Password123',
    role: Role.RETAILER,
    companyName: 'Retail Co',
    taxCode: '11223344',
    specialisations: ['Retail'],
  },
  {
    name: 'Yanbellq | Max',
    email: 'yanbellq@gmail.com',
    password: 'Password123',
    role: Role.SUPPLIER,
    companyName: '@HruCorp',
    taxCode: '12312345',
    specialisations: ['House-Loft-Furniture'],
  },
];

async function seedSpaceTypes(): Promise<Record<string, string>> {
  console.log('🌱 Seeding space types...');
  const result: Record<string, string> = {};

  for (const st of SPACE_TYPES) {
    const slug = generateSlug(st.title);
    const spaceType = await prisma.spaceType.upsert({
      where: { slug },
      update: {},
      create: { title: st.title, slug },
    });
    result[st.title] = spaceType.id;
    console.log(`  ✅ SpaceType: ${st.title}`);
  }

  return result;
}

async function seedCategories(): Promise<Record<string, string>> {
  console.log('🌱 Seeding categories...');
  const result: Record<string, string> = {};

  for (const cat of CATEGORIES) {
    const slug = generateSlug(cat.title);
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { title: cat.title, slug },
    });
    result[cat.title] = category.id;
    console.log(`  ✅ Category: ${cat.title}`);
  }

  return result;
}

function upsertTag(title: string) {
  const slug = generateSlug(title);
  return prisma.productTag.upsert({
    where: { slug },
    update: {},
    create: { title, slug },
  });
}

async function seedUsers(): Promise<
  Record<string, { id: string; companyId: string; abbreviation: string }>
> {
  console.log('🌱 Seeding users...');
  const result: Record<
    string,
    { id: string; companyId: string; abbreviation: string }
  > = {};

  for (const userData of USERS) {
    const passwordHash = await hashPassword(userData.password);

    const userWithCompany = await prisma.$transaction(async tx => {
      let user = await tx.user.findUnique({ where: { email: userData.email } });

      if (!user) {
        user = await tx.user.create({
          data: {
            id: nanoid(),
            name: userData.name,
            email: userData.email,
            emailVerified: true,
            role: userData.role,
            accounts: {
              create: {
                id: nanoid(),
                accountId: nanoid(),
                providerId: 'credential',
                password: passwordHash,
              },
            },
          },
        });
      }

      let company = await tx.company.findUnique({
        where: { taxCode: userData.taxCode },
      });

      if (!company) {
        const baseAbbr = generateAbbreviation(userData.companyName);
        let abbreviation = baseAbbr;
        let counter = 1;

        while (true) {
          const exists = await tx.company.findUnique({
            where: { abbreviation },
          });
          if (!exists) break;
          abbreviation = `${baseAbbr.substring(0, 2)}${counter}`;
          counter++;
        }

        company = await tx.company.create({
          data: {
            id: nanoid(),
            name: userData.companyName,
            abbreviation,
            taxCode: userData.taxCode,
            specializations: userData.specialisations,
          },
        });
      }

      await tx.profile.upsert({
        where: { userId: user.id },
        update: { companyId: company.id },
        create: {
          id: nanoid(),
          userId: user.id,
          companyId: company.id,
        },
      });

      return {
        userId: user.id,
        companyId: company.id,
        abbreviation: company.abbreviation,
      };
    });

    result[userData.email] = {
      id: userWithCompany.userId,
      companyId: userWithCompany.companyId,
      abbreviation: userWithCompany.abbreviation,
    };

    console.log(
      `  ✅ User & Company: ${userData.email} (${userData.role}) -> Spec: ${userData.specialisations.join(', ')}`,
    );
  }

  return result;
}

async function seedCarts(
  users: Record<
    string,
    { id: string; companyId: string; abbreviation: string }
  >,
  products: Record<string, string>,
): Promise<void> {
  console.log('🌱 Seeding carts...');

  const retailerId = users['retailer@gyp6.sale']?.id;
  if (!retailerId) {
    console.warn('  ⚠️ Skip cart: retailer not found');
    return;
  }

  const deskId = products['Modern Office Desk'];
  if (!deskId) {
    console.warn('  ⚠️ Skip cart: product not found');
    return;
  }

  // const deskPrice = await prisma.product
  //   .findUnique({ where: { id: deskId } })
  //   .then(p => p?.price ?? 0);

  const cart = await prisma.cart.upsert({
    where: { userId: retailerId },
    update: {},
    create: {
      id: nanoid(),
      userId: retailerId,
    },
  });

  // Додаємо товар тільки якщо кошик порожній
  const existingItems = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
  });

  if (existingItems.length === 0) {
    await prisma.cartItem.create({
      data: {
        id: nanoid(),
        cartId: cart.id,
        productId: deskId,
        quantity: 2,
      },
    });
    console.log(`  ✅ Cart for retailer with product: Modern Office Desk x2`);
  } else {
    console.log(`  ♻️  Cart for retailer already has items`);
  }
}

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────

async function main() {
  console.log('🚀 Starting seed...\n');

  const spaceTypes = await seedSpaceTypes();
  const categories = await seedCategories();
  const users = await seedUsers();
  const products = {};
  await seedCarts(users, products);

  console.log('\n✨ Seed completed successfully');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
