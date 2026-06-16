import { SmartSkuService } from '../smart-sku.service';

// Поправ шлях до свого файлу з сервісом

// Імітуємо дані, які приходять при створені різних товарів
const testProducts = [
  {
    name: 'Стілець звичайний',
    price: 150,
    sequence: 1,
    manufacturerCode: 'HC',
  },
  {
    name: 'Стілець звичайний',
    price: 150,
    sequence: 2,
    manufacturerCode: 'HC',
  }, // Той самий товар, але вже другий для цього саплаєра
  {
    name: 'Стілець звичайний',
    price: 180,
    sequence: 1,
    manufacturerCode: 'HC',
  }, // Змінилася ціна -> зміниться хеш
  {
    name: 'Диван Люкс PascalCase',
    price: 1200,
    sequence: 12,
    manufacturerCode: 'GW',
  },
  { name: 'Ikea Table', price: 85, sequence: 345, manufacturerCode: 'IKE' },
];

function runTest() {
  // Створюємо інстанс класу, оскільки методи більше не статичні
  const smartSkuService = new SmartSkuService();

  console.log('=== ТЕСТ ГЕНЕРАЦІЇ АРТИКУЛІВ (Smart SKU) ===\n');

  testProducts.forEach((prod, index) => {
    // 1. Генеруємо артикул через інстанс сервісу
    const sku = smartSkuService.generate(prod);
    console.log(
      `${index + 1}. Дані: "${prod.name}" за $${prod.price} (Seq: ${prod.sequence}, Код: ${prod.manufacturerCode})`,
    );
    console.log(`   Артикул ->  \x1b[32m${sku}\x1b[0m`); // Виведе артикул зеленим кольором

    // 2. Тестуємо реверс (парсинг) цього ж артикулу
    const parsed = smartSkuService.parse(sku);
    console.log(
      `   Реверс  ->  Компанія: \x1b[36m${parsed.company}\x1b[0m | Хеш: \x1b[35m${parsed.dataHash}\x1b[0m | Номер: \x1b[33m${parsed.sequence}\x1b[0m | Саплаєр: \x1b[34m${parsed.manufacturerCode}\x1b[0m`,
    );
    console.log('-'.repeat(80));
  });

  // Тест на випадок, якщо хтось введе битий артикул
  console.log('\n=== ТЕСТ ВАЛІДАЦІЇ НА ПРАВИЛЬНІСТЬ ФОРМАТУ ===');
  try {
    smartSkuService.parse('INVALID-SKU-123');
  } catch (error: any) {
    console.log(
      `❌ Перевірка помилки працює: \x1b[31m"${error.message}"\x1b[0m`,
    );
  }
}

// Запуск тесту
runTest();
