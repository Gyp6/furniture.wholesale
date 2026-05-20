// prisma/seed.ts
import { hash } from '@node-rs/argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, ProductStatus, Role, SpaceType } from '@prisma/client';
import 'dotenv/config';
import { nanoid } from 'nanoid';

import { generateSlug } from '@/core/lib/slugify.lib';

import { SmartSkuService } from '../smart-sku/smart-sku.service';

const db_url = process.env.DATABASE_URL;
console.log('DEBUG, prisma seed db_url:', db_url);

const adapter = new PrismaPg({
  connectionString: db_url as string,
});
const prisma = new PrismaClient({ adapter });

// --- Допоміжні утиліти для SKU та Абревіатур ---
function seedGenerateSlug(text: string): string {
  return generateSlug(text);
}

function generateAbbreviation(name: string): string {
  return name
    .replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '')
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 4);
}

// function generateSku(
//   name: string,
//   price: number,
//   sequence: number,
//   mfgCode: string,
// ): string {
//   const dataString = `${name.trim().toLowerCase()}|${price}`;
//   const hashNumber = fnv1a(dataString);
//   const dataHash = hashNumber.toString(36).toUpperCase().padStart(10, '0');
//   const paddedSeq = String(sequence).padStart(3, '0');
//   return `GYP6-${dataHash}NBR${paddedSeq}-${mfgCode.toUpperCase()}`;
// }

// --- Дані як в DTO ---

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
];

const PRODUCTS = [
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Nordic Wooden Dining Table',
    images: ['marketplace/table-1.png'],
    price: 12500,
    minSellUnits: 4,
    categoryTitle: 'Dining',
    tags: ['Nordic', 'Дерево'],
    spaceType: SpaceType.RESTAURANT,
    status: ProductStatus.ACTIVE,
    dimension: { width: 1800, height: 750, depth: 900 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Industrial Metal Chair',
    images: ['marketplace/chair-1.png'],
    price: 3200,
    minSellUnits: 10,
    categoryTitle: 'Seating',
    tags: ['Loft', 'Industrial'],
    spaceType: SpaceType.CAFE,
    status: ProductStatus.ACTIVE,
    dimension: { width: 450, height: 850, depth: 500 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Modern Office Desk',
    images: ['marketplace/desk-1.png'],
    price: 18000,
    minSellUnits: 2,
    categoryTitle: 'Tables & Desks',
    tags: ['Мінімалізм', 'Office'],
    spaceType: SpaceType.OFFICE,
    status: ProductStatus.ACTIVE,
    dimension: { width: 1400, height: 750, depth: 700 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Luxury Lobby Sofa',
    images: ['marketplace/sofa-1.png'],
    price: 45000,
    minSellUnits: 1,
    categoryTitle: 'Lounge',
    tags: ['Luxury', 'Диван'],
    spaceType: SpaceType.HOTEL,
    status: ProductStatus.ACTIVE,
    dimension: { width: 2200, height: 800, depth: 950 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Minimalist Coffee Table',
    images: ['marketplace/coffee-table-1.png'],
    price: 7500,
    minSellUnits: 5,
    categoryTitle: 'Lounge',
    tags: ['Мінімалізм'],
    spaceType: SpaceType.HOTEL,
    status: ProductStatus.ACTIVE,
    dimension: { width: 800, height: 450, depth: 800 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Bistro Outdoor Set',
    images: ['marketplace/bistro-1.png'],
    price: 15000,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceType: SpaceType.RESTAURANT,
    status: ProductStatus.ACTIVE,
    dimension: { width: 700, height: 750, depth: 700 },
  },
  ...Array.from({ length: 20 }).map((_, i) => ({
    supplierEmail: 'supplier@gyp6.sale',
    title: `Extra Product ${i + 7}`,
    images: ['marketplace/table-1.png'],
    price: 5000 + i * 1000,
    minSellUnits: i + 1,
    categoryTitle: 'Tables & Desks',
    tags: ['Мінімалізм'],
    spaceType: SpaceType.COWORKING,
    status: ProductStatus.ACTIVE,
    dimension: { width: 1200, height: 750, depth: 600 },
  })),
];

function upsertTag(title: string) {
  const slug = seedGenerateSlug(title);
  return prisma.productTag.upsert({
    where: { slug },
    update: {},
    create: { title, slug },
  });
}

async function seedCategories() {
  console.log('🌱 Seeding categories...');
  const result: Record<string, string> = {};

  for (const cat of CATEGORIES) {
    const slug = seedGenerateSlug(cat.title);
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

async function seedUsers() {
  console.log('🌱 Seeding users...');
  const result: Record<
    string,
    { id: string; companyId: string; abbreviation: string }
  > = {};

  for (const userData of USERS) {
    const passwordHash = await hash(userData.password);

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
            specializations: userData.specialisations, // 👈 ТЕПЕР СПЕЦІАЛІЗАЦІЇ СЕРЕД КЛЮЧІВ КОМПАНІЇ
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

async function seedProducts(
  users: Record<
    string,
    { id: string; companyId: string; abbreviation: string }
  >,
  categories: Record<string, string>,
) {
  console.log('🌱 Seeding products...');

  for (const [index, productData] of PRODUCTS.entries()) {
    const supplier = users[productData.supplierEmail];
    const categoryId = categories[productData.categoryTitle];

    if (!supplier || !categoryId) {
      console.warn(
        `  ⚠️ Skip product: ${productData.title} (Supplier/Category error)`,
      );
      continue;
    }

    const tagConnections = await Promise.all(
      productData.tags.map(async title => {
        const tag = await upsertTag(title);
        return { tag: { connect: { id: tag.id } } };
      }),
    );

    const existing = await prisma.product.findFirst({
      where: { title: productData.title, supplierId: supplier.id },
    });

    if (!existing) {
      const smartSkuService = new SmartSkuService();
      const productSku = smartSkuService.generate({
        name: productData.title,
        price: productData.price,
        sequence: index + 1,
        manufacturerCode: supplier.abbreviation,
      });

      await prisma.$transaction(async tx => {
        const newDimension = await tx.dimension.create({
          data: {
            width: productData.dimension.width,
            height: productData.dimension.height,
            depth: productData.dimension.depth,
          },
        });
        await tx.product.create({
          data: {
            id: nanoid(),
            sku: productSku,
            title: productData.title,
            images: productData.images,
            price: productData.price,
            minSellUnits: productData.minSellUnits,
            status: productData.status,
            spaceType: productData.spaceType,
            categoryId,
            supplierId: supplier.id,
            manufacturerId: supplier.companyId,
            dimensionId: newDimension.id,
            tags: { create: tagConnections },
          },
        });
      });
    }

    console.log(`  ✅ Product: ${productData.title}`);
  }
}

async function main() {
  console.log('🚀 Starting seed...\n');

  const categories = await seedCategories();
  const users = await seedUsers();
  await seedProducts(users, categories);

  console.log('\n✨ Seed completed successfully');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
