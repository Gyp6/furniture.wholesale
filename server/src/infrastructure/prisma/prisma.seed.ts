// prisma/seed.ts
import { hash } from '@node-rs/argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, ProductStatus, Role, SpaceType } from '@prisma/client';
import 'dotenv/config';
import { nanoid } from 'nanoid';

import { generateSlug } from '@/core/lib/slugify.lib';

const db_url = process.env.DATABASE_URL;

console.log('DEBUG, prisma seed db_url:', db_url);

const adapter = new PrismaPg({
  connectionString: db_url as string,
});
const prisma = new PrismaClient({ adapter });

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

const USERS: Array<{
  name: string;
  email: string;
  password: string;
  role: Role;
  companyName: string;
  taxId: string;
  specialisations: string[];
}> = [
  {
    name: 'Admin User',
    email: 'admin@gyp6.sale',
    password: 'Password123',
    role: Role.ADMIN,
    companyName: 'GYP6 Admin',
    taxId: '0000000000',
    specialisations: ['Coworking'],
  },
  {
    name: 'Supplier One',
    email: 'supplier@gyp6.sale',
    password: 'Password123',
    role: Role.SUPPLIER,
    companyName: 'Furniture UA',
    taxId: '12345678',
    specialisations: ['Restaurant'],
  },
  {
    name: 'Designer One',
    email: 'designer@gyp6.sale',
    password: 'Password123',
    role: Role.DESIGNER,
    companyName: 'Design Studio',
    taxId: '87654321',
    specialisations: ['Interior Design', 'Architecture'],
  },
];

const PRODUCTS: Array<{
  supplierEmail: string;
  title: string;
  images: string[];
  price: number;
  minSellQuantity?: number;
  categoryTitle: string;
  tags: string[];
  spaceType: SpaceType;
  status: ProductStatus;
}> = [
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Nordic Wooden Dining Table',
    images: ['marketplace/table-1.png'],
    price: 12500,
    minSellQuantity: 4,
    categoryTitle: 'Dining',
    tags: ['Nordic', 'Дерево'],
    spaceType: SpaceType.RESTAURANT,
    status: ProductStatus.ACTIVE,
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Industrial Metal Chair',
    images: ['marketplace/table-1.png'],
    price: 3200,
    minSellQuantity: 10,
    categoryTitle: 'Seating',
    tags: ['Loft', 'Industrial'],
    spaceType: SpaceType.CAFE,
    status: ProductStatus.ACTIVE,
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Modern Office Desk',
    images: ['marketplace/table-1.png'],
    price: 18000,
    minSellQuantity: 2,
    categoryTitle: 'Seating',
    tags: ['Мінімалізм', 'Office'],
    spaceType: SpaceType.OFFICE,
    status: ProductStatus.ACTIVE,
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Luxury Lobby Sofa',
    images: ['marketplace/table-1.png'],
    price: 45000,
    minSellQuantity: 1,
    categoryTitle: 'Seating',
    tags: ['Luxury', 'Диван'],
    spaceType: SpaceType.HOTEL,
    status: ProductStatus.ACTIVE,
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Minimalist Coffee Table',
    images: ['marketplace/table-1.png'],
    price: 7500,
    minSellQuantity: 5,
    categoryTitle: 'Outdoor',
    tags: ['Мінімалізм'],
    spaceType: SpaceType.HOTEL,
    status: ProductStatus.ACTIVE,
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Bistro Outdoor Set',
    images: ['marketplace/table-1.png'],
    price: 15000,
    minSellQuantity: 4,
    categoryTitle: 'Industrial',
    tags: ['Nordic', 'Outdoor'],
    spaceType: SpaceType.RESTAURANT,
    status: ProductStatus.ACTIVE,
  },
  ...Array.from({ length: 20 }).map((_, i) => ({
    supplierEmail: 'supplier@gyp6.sale',
    title: `Extra Product ${i + 7}`,
    images: ['marketplace/table-1.png'],
    price: 5000 + i * 1000,
    minSellQuantity: 1,
    categoryTitle: 'Tables & Desks',
    tags: ['Мінімалізм'],
    spaceType: SpaceType.COWORKING,
    status: ProductStatus.ACTIVE,
  })),
];

async function upsertTag(title: string) {
  const slug = generateSlug(title);
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

async function seedUsers() {
  console.log('🌱 Seeding users...');
  const result: Record<string, { id: string; companyId: string }> = {};

  for (const userData of USERS) {
    const passwordHash = await hash(userData.password);

    await prisma.$transaction(async tx => {
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

      // 2. Компанія — як в CompanyRepository.create
      let company = await tx.company.findUnique({
        where: { taxId: userData.taxId },
      });

      if (!company) {
        company = await tx.company.create({
          data: {
            id: nanoid(),
            name: userData.companyName,
            taxId: userData.taxId,
          },
        });
      }

      await tx.profile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          id: nanoid(),
          userId: user.id,
          companyId: company.id,
          specializations: userData.specialisations,
        },
      });

      result[userData.email] = { id: user.id, companyId: company.id };
    });

    console.log(`  ✅ User: ${userData.email} (${userData.role})`);
  }

  return result;
}

async function seedProducts(
  users: Record<string, { id: string; companyId: string }>,
  categories: Record<string, string>,
) {
  console.log('🌱 Seeding products...');

  for (const productData of PRODUCTS) {
    const supplier = users[productData.supplierEmail];
    const categoryId = categories[productData.categoryTitle];

    if (!supplier) {
      console.warn(`  ⚠️ Supplier not found: ${productData.supplierEmail}`);
      continue;
    }

    if (!categoryId) {
      console.warn(`  ⚠️ Category not found: ${productData.categoryTitle}`);
      continue;
    }

    // Повторює логіку ProductRepository.buildTagConnections
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
      await prisma.product.create({
        data: {
          id: nanoid(),
          title: productData.title,
          images: productData.images,
          price: productData.price,
          minSellQuantity: productData.minSellQuantity ?? null,
          categoryId,
          supplierId: supplier.id,
          vendorId: supplier.companyId,
          spaceType: productData.spaceType,
          status: productData.status,
          tags: { create: tagConnections },
        },
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
