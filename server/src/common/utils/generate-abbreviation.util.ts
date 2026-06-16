export function generateAbbreviation(name: string, maxLength = 3): string {
  const stopWords = new Set([
    'and',
    'or',
    'the',
    'of',
    'with',
    'co',
    'ltd',
    'inc',
    'та',
    'і',
    'в',
  ]);

  const splitCamelCase = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

  const cleanName = splitCamelCase
    .replace(/[^a-zA-Z0-9а-яА-ЯіІїЇєЄґҐ\s]/g, '')
    .trim();

  const words = cleanName.split(/\s+/);

  let acronym = words
    .filter(word => word.length > 0 && !stopWords.has(word.toLowerCase()))
    .map(word => word[0].toUpperCase())
    .join('');

  if (acronym.length === 1 && cleanName.length > 1) {
    acronym = cleanName.substring(0, maxLength).toUpperCase();
  }

  return acronym.substring(0, maxLength);
}
