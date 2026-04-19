import LanguageDetect from 'languagedetect';
import slugify from 'slugify';

const lngDetector = new LanguageDetect();

export const generateSlug = (text: string): string => {
  // Отримуємо список ймовірних мов (наприклад, [['ukrainian', 0.5], ['russian', 0.3]])
  const detectedLanguages = lngDetector.detect(text);

  // Шукаємо, чи є в результатах російська.
  // Якщо текст дуже схожий на російську (наприклад, є "ы" або "ё"), ставимо 'ru'.
  // В усіх інших випадках (або якщо мова не визначена) — 'uk'.
  let detectedLocale = 'uk';

  if (detectedLanguages.length > 0) {
    const topLanguage = detectedLanguages[0][0];
    if (topLanguage === 'russian') {
      detectedLocale = 'ru';
    }
  }

  return slugify(text, {
    replacement: '-',
    lower: true,
    strict: true,
    locale: detectedLocale,
    trim: true,
  });
};
