import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateProductRequest } from '../requests/create-product.request';

// Допоміжна функція для швидкого прогону валідації
async function getValidationErrors(plainObject: Record<string, any>) {
  const objectInstance = plainToInstance(CreateProductRequest, plainObject);
  return await validate(objectInstance);
}

const VALID_PRODUCT = {
  title: 'Freedom Miro dining table',
  images: ['products/abc/image1.png', 'products/abc/image2.png'],
  price: 1999.99,
  stock: 120,
  minSellUnits: 2,
  categoryId: 'category-id-123',
  dimension: {
    width: 1400,
    height: 750,
    depth: 900,
  },
  tags: ['Nordic', 'Scandinavian'],
  spaceType: 'APARTMENT',
};

// Загортаємо все в асинхронну функцію, щоб не було Top-Level await
async function runTest() {
  console.log('=== ТЕСТ ВАЛІДАЦІЇ CreateProductRequest DTO ===\n');

  // --- ТЕСТ 1: Валідні дані ---
  const validErrors = await getValidationErrors(VALID_PRODUCT);
  if (validErrors.length === 0) {
    console.log("✅ Тест 1: Валідний об'єкт пройшов перевірку успішно.");
  } else {
    console.error(
      '❌ Тест 1 ПРОВАЛЕНО. Знайдено неочікувані помилки:',
      JSON.stringify(validErrors, null, 2),
    );
  }

  console.log('-'.repeat(80));

  // --- ТЕСТ 2: Жорстка валідація основних полів ---
  const badProduct = {
    ...VALID_PRODUCT,
    title: 'X',
    price: -50,
    stock: 0,
    images: [],
    tags: ['A'],
    spaceType: 'INVALID_ENUM_VALUE',
  };

  const badErrors = await getValidationErrors(badProduct);
  console.log(
    `⚠️ Тест 2: Об'єкт із битими полями повернув ${badErrors.length} помилок (очікувано).`,
  );

  badErrors.forEach(err => {
    console.log(
      `   • Поле [\x1b[33m${err.property}\x1b[0m]:`,
      Object.values(err.constraints || {}).join(', '),
    );
  });

  console.log('-'.repeat(80));

  // --- ТЕСТ 3: Валідація вкладеного об'єкта ---
  const badNestedProduct = {
    ...VALID_PRODUCT,
    dimension: {
      width: 'not-a-number',
      height: 750,
    },
  };

  const nestedErrors = await getValidationErrors(badNestedProduct);
  const dimensionError = nestedErrors.find(e => e.property === 'dimension');

  if (
    dimensionError &&
    dimensionError.children &&
    dimensionError.children.length > 0
  ) {
    console.log(
      "✅ Тест 3: Глибока валідація вкладеного об'єкта DimensionRequest працює ідеально!",
    );
    dimensionError.children.forEach(childErr => {
      console.log(
        `   • Вкладене поле [dimension.\x1b[35m${childErr.property}\x1b[0m]:`,
        Object.values(childErr.constraints || {}).join(', '),
      );
    });
  } else {
    console.error(
      '❌ Тест 3 ПРОВАЛЕНО. Вкладена валідація для dimension не спрацювала!',
    );
  }

  console.log('\n==============================================');
}

// Запускаємо наш ранер
runTest().catch(console.error);
