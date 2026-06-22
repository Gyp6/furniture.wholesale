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
    name: 'Anton',
    email: 'supplier@gyp6.sale',
    password: 'Password123',
    role: Role.SUPPLIER,
    companyName: 'Furniture UA',
    taxCode: '12345678',
    specialisations: ['Restaurant'],
  },
  {
    name: 'Maksym',
    email: 'horeca@gyp6.sale',
    password: 'Password123',
    role: Role.HORECA,
    companyName: 'Furniture UA',
    taxCode: '12345678',
    specialisations: ['Restaurant'],
  },
  {
    name: 'Sophia',
    email: 'stepaniatova.sofiia@chnu.edu.ua',
    password: 'Password123',
    role: Role.SUPPLIER,
    companyName: 'Furniture UA',
    taxCode: '12345678',
    specialisations: ['Restaurant'],
  },
  {
    name: 'Maria',
    email: 'designer@gyp6.sale',
    password: 'Password1234',
    role: Role.DESIGNER,
    companyName: 'Design Studio',
    taxCode: '87654321',
    specialisations: ['Interior Design', 'Architecture'],
  },
  {
    name: 'Anastatia',
    email: 'retailer@gyp6.sale',
    password: 'Password122',
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

const PRODUCTS = [
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Nordic Wooden Dining Table',
    imagesCount: 5,
    price: 12500,
    minSellUnits: 4,
    categoryTitle: 'Dining',
    tags: ['Nordic', 'Wood'],
    spaceTypeTitles: ['Restaurant'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 1800, height: 750, depth: 900 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Industrial Metal Chair',
    imagesCount: 5,
    price: 3200,
    minSellUnits: 10,
    categoryTitle: 'Seating',
    tags: ['Loft', 'Industrial'],
    spaceTypeTitles: ['Cafe'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 450, height: 850, depth: 500 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Modern Office Desk',
    imagesCount: 5,
    price: 18000,
    minSellUnits: 2,
    categoryTitle: 'Tables & Desks',
    tags: ['Minimal', 'Office'],
    spaceTypeTitles: ['Office'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 1400, height: 750, depth: 700 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Luxury Lobby Sofa',
    imagesCount: 5,
    price: 45000,
    minSellUnits: 1,
    categoryTitle: 'Lounge',
    tags: ['Luxury', 'Sofa'],
    spaceTypeTitles: ['Hotel'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 2200, height: 800, depth: 950 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Minimalist Coffee Table',
    imagesCount: 5,
    price: 7500,
    minSellUnits: 5,
    categoryTitle: 'Lounge',
    tags: ['Minimal'],
    spaceTypeTitles: ['Hotel'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 800, height: 450, depth: 800 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Bistro Outdoor Set',
    imagesCount: 5,
    price: 15000,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Restaurant'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 700, height: 750, depth: 700 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Office chair RZTK Dzen Black',
    imagesCount: 10,
    price: 30990,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Restaurant'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 700, height: 750, depth: 700 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Adjustable table Barsky StandUp White (BST-02)',
    imagesCount: 15,
    price: 70680,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Cafe'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 120, height: 120, depth: 60 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title:
      'Sofa with armrests Tobi Sho Benno-1 office with tapered leg velor Emilia 38 EMERALD',
    imagesCount: 20,
    price: 163800,
    minSellUnits: 5,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Cafe'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 1500, height: 750, depth: 750 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title:
      'Modern gray two-door wardrobe 2D "Omega" in loft style Furniture Service for office oak tobacco matera',
    imagesCount: 15,
    price: 114660,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Cafe'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 200, height: 55, depth: 83 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title:
      'Functional desk with drawer and cabinet for the office Oriental Tree Forte',
    imagesCount: 13,
    price: 131130,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Office'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 129, height: 74, depth: 60 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Modern cabinet with drawers for the office and study',
    imagesCount: 7,
    price: 72191,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Hotel'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 39, height: 60, depth: 50 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Computer desk with metal frame in Loft style',
    imagesCount: 6,
    price: 37194,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Coworking'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 1000, height: 700, depth: 600 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Office chair for manager for staff',
    imagesCount: 5,
    price: 29500,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Coworking'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 129, height: 74, depth: 60 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Office table FlashNika Eco CH-14 142',
    imagesCount: 10,
    price: 47060,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Coworking'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 129, height: 80, depth: 60 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Four-door cabinet for home and office with drawers',
    imagesCount: 13,
    price: 131130,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Bar'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 700, height: 900, depth: 300 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title:
      'Functional desk with drawer and cabinet for the office Oriental Tree Forte',
    imagesCount: 14,
    price: 154952,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Bar'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 129, height: 74, depth: 60 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title:
      'Tobi Sho reception desk for office, salon with lighting and drawers',
    imagesCount: 5,
    price: 71970,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Restaurant'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 1800, height: 800, depth: 1000 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Computer desk with two bedside tables for the office',
    imagesCount: 9,
    price: 56070,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Restaurant'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 1600, height: 755, depth: 600 },
  },
  {
    supplierEmail: 'supplier@gyp6.sale',
    title: 'Double desk with drawers for study or office',
    imagesCount: 9,
    price: 65541,
    minSellUnits: 4,
    categoryTitle: 'Outdoor',
    tags: ['Nordic', 'Outdoor'],
    spaceTypeTitles: ['Restaurant'],
    status: ProductStatus.ACTIVE,
    dimension: { width: 139, height: 140, depth: 60 },
  },
];

// ─────────────────────────────────────────
// SEEDERS
// ─────────────────────────────────────────

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

async function seedProducts(
  users: Record<
    string,
    { id: string; companyId: string; abbreviation: string }
  >,
  categories: Record<string, string>,
  spaceTypes: Record<string, string>,
): Promise<Record<string, string>> {
  console.log('🌱 Seeding products...');
  const result: Record<string, string> = {}; // title -> id

  for (const [index, productData] of PRODUCTS.entries()) {
    const supplier = users[productData.supplierEmail];
    const categoryId = categories[productData.categoryTitle];

    const spaceTypeIds = productData.spaceTypeTitles
      .map(t => spaceTypes[t])
      .filter(Boolean);

    if (!supplier || !categoryId || spaceTypeIds.length === 0) {
      console.warn(
        `  ⚠️ Skip product: ${productData.title} (Supplier/Category/SpaceType not found)`,
      );
      continue;
    }

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

      const tagConnections = await Promise.all(
        productData.tags.map(async title => {
          const tag = await upsertTag(title);
          return { tag: { connect: { id: tag.id } } };
        }),
      );

      const spaceConnections = spaceTypeIds.map(spaceTypeId => ({
        spaceType: { connect: { id: spaceTypeId } },
      }));

      const created = await prisma.$transaction(async tx => {
        const dimension = await tx.dimension.create({
          data: {
            width: productData.dimension.width,
            height: productData.dimension.height,
            depth: productData.dimension.depth,
          },
        });

        return tx.product.create({
          data: {
            id: nanoid(),
            sku: productSku,
            title: productData.title,
            imagesCount: productData.imagesCount,
            price: productData.price,
            stock:
              (productData as any).stock ?? Math.floor(Math.random() * 80) + 20,
            minSellUnits: productData.minSellUnits,
            status: productData.status,
            categoryId,
            supplierId: supplier.id,
            manufacturerId: supplier.companyId,
            dimensionId: dimension.id,
            tags: { create: tagConnections },
            spaces: { create: spaceConnections },
          },
        });
      });

      result[productData.title] = created.id;
    } else {
      result[productData.title] = existing.id;
    }

    console.log(`  ✅ Product: ${productData.title}`);
  }

  return result;
}

async function seedBundles(
  users: Record<
    string,
    { id: string; companyId: string; abbreviation: string }
  >,
  products: Record<string, string>,
  spaceTypes: Record<string, string>,
): Promise<void> {
  console.log('🌱 Seeding bundles...');

  const supplierId = users['supplier@gyp6.sale']?.id;
  const designerId = users['designer@gyp6.sale']?.id;
  const restaurantSpaceId = spaceTypes['Restaurant'];
  const officeSpaceId = spaceTypes['Office'];

  if (!supplierId || !designerId || !restaurantSpaceId || !officeSpaceId) {
    console.warn('  ⚠️ Skip bundles: required users/spaceTypes not found');
    return;
  }

  // ── SUPPLIER-бандл: Restaurant Starter Kit ──────────────────────
  // depth = 0, тільки товари, без вкладених бандлів
  const existingSupplierBundle = await prisma.bundle.findFirst({
    where: { name: 'Restaurant Starter Kit', userId: supplierId },
  });

  let supplierBundleId: string;

  if (!existingSupplierBundle) {
    const tableId = products['Nordic Wooden Dining Table'];
    const chairId = products['Industrial Metal Chair'];

    if (!tableId || !chairId) {
      console.warn('  ⚠️ Skip supplier bundle: products not found');
      return;
    }

    const tablePrice = await prisma.product
      .findUnique({ where: { id: tableId } })
      .then(p => p?.price ?? 0);
    const chairPrice = await prisma.product
      .findUnique({ where: { id: chairId } })
      .then(p => p?.price ?? 0);

    const supplierBundle = await prisma.bundle.create({
      data: {
        id: nanoid(),
        bundleType: BundleType.SUPPLIER,
        depth: 0,
        userId: supplierId,
        name: 'Restaurant Starter Kit',
        description: 'Базовий набір для ресторану: стіл та стільці',
        status: ProductStatus.ACTIVE,
        spaceTypeId: restaurantSpaceId,
        items: {
          create: [
            {
              id: nanoid(),
              productId: tableId,
              quantity: 1,
              priceSnapshot: tablePrice,
            },
            {
              id: nanoid(),
              productId: chairId,
              quantity: 4,
              priceSnapshot: chairPrice,
            },
          ],
        },
      },
    });

    supplierBundleId = supplierBundle.id;
    console.log(`  ✅ Supplier bundle: ${supplierBundle.name}`);
  } else {
    supplierBundleId = existingSupplierBundle.id;
    console.log(`  ♻️  Supplier bundle already exists: Restaurant Starter Kit`);
  }

  // ── USER-бандл: дизайнер збирає кошик ───────────────────────────
  // depth = 1, містить SUPPLIER-бандл + окремий товар
  const existingUserBundle = await prisma.bundle.findFirst({
    where: { name: 'My Restaurant Design', userId: designerId },
  });

  if (!existingUserBundle) {
    const sofaId = products['Luxury Lobby Sofa'];
    const sofaPrice = sofaId
      ? await prisma.product
          .findUnique({ where: { id: sofaId } })
          .then(p => p?.price ?? 0)
      : null;

    // Отримуємо snapshot ціни supplier-бандлу (сума товарів)
    const supplierBundleItems = await prisma.bundleItem.findMany({
      where: { bundleId: supplierBundleId },
    });
    const supplierBundlePrice = supplierBundleItems.reduce(
      (sum, item) => sum + Number(item.priceSnapshot) * item.quantity,
      0,
    );

    const userBundle = await prisma.bundle.create({
      data: {
        id: nanoid(),
        bundleType: BundleType.USER,
        depth: 1,
        userId: designerId,
        name: 'My Restaurant Design',
        description:
          'Комплект для ресторану від дизайнера: набір + диван у лоббі',
        status: ProductStatus.DRAFT,
        isShared: true,
        shareToken: nanoid(),
        spaceTypeId: restaurantSpaceId,
        items: {
          create: [
            // Варіант Б: вкладений SUPPLIER-бандл
            {
              id: nanoid(),
              nestedBundleId: supplierBundleId,
              quantity: 1,
              priceSnapshot: supplierBundlePrice,
            },
            // Варіант А: окремий товар (якщо є)
            ...(sofaId && sofaPrice !== null
              ? [
                  {
                    id: nanoid(),
                    productId: sofaId,
                    quantity: 1,
                    priceSnapshot: sofaPrice,
                  },
                ]
              : []),
          ],
        },
      },
    });

    console.log(
      `  ✅ User bundle: ${userBundle.name} (shared, token: ${userBundle.shareToken})`,
    );
  } else {
    console.log(`  ♻️  User bundle already exists: My Restaurant Design`);
  }
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
  const products = await seedProducts(users, categories, spaceTypes);
  await seedBundles(users, products, spaceTypes);
  await seedCarts(users, products);

  console.log('\n✨ Seed completed successfully');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
