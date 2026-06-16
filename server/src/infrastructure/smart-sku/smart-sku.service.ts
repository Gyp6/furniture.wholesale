import fnv1a from 'fnv1a';

interface SkuDataInput {
  name: string;
  price: number;
  sequence: number;
  manufacturerCode: string;
}

interface DecodedSku {
  company: string;
  dataHash: string;
  sequence: number;
  manufacturerCode: string;
}

export class SmartSkuService {
  private readonly COMPANY = 'GYP6';
  private readonly SEPARATOR = 'NBR';

  /**
   * 1. ГЕНЕРАЦІЯ АРТИКУЛУ
   * Формат: GYP6-[HASH]NBR[SEQ]-[MANUFACTURER]
   */
  generate({ name, price, sequence, manufacturerCode }: SkuDataInput): string {
    // Нормалізуємо дані для хешу (наприклад: "стілець звичайний|150")
    const dataString = `${name.trim().toLowerCase()}|${price}`;

    // Генеруємо числовий хеш і переводимо в Base36 (0-9, A-Z)
    const hashNumber = fnv1a(dataString);
    const dataHash = hashNumber.toString(36).toUpperCase().padStart(10, '0');

    // Форматуємо порядковий номер (наприклад: 001, 012, 125)
    const paddedSeq = String(sequence).padStart(3, '0');

    // Очищаємо код мануфактурера
    const mfg = manufacturerCode.trim().toUpperCase();

    return `${this.COMPANY}-${dataHash}${this.SEPARATOR}${paddedSeq}-${mfg}`;
  }

  /**
   * 2. РЕВЕРС (РОЗПАРСУВАННЯ) АРТИКУЛУ
   * Розбиває артикул на складові частини
   */
  parse(sku: string): DecodedSku {
    const regex = new RegExp(
      `^${this.COMPANY}-([A-Z0-9]+)${this.SEPARATOR}(\\d+)-([A-Z]+)$`,
    );

    const match = sku.toUpperCase().trim().match(regex);

    if (!match) {
      throw new Error('Invalid sku format');
    }

    const [, dataHash, sequenceStr, manufacturerCode] = match;

    return {
      company: this.COMPANY,
      dataHash,
      sequence: parseInt(sequenceStr, 10),
      manufacturerCode,
    };
  }
}
