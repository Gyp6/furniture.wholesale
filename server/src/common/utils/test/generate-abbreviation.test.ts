import { generateAbbreviation } from '../generate-abbreviation.util';

console.log(
  '1.' + generateAbbreviation('HruCorp'), // -> "HC"  (розбило на Hru Corp)
  '2.' + generateAbbreviation('Gyp6Wholesale'), // -> "GW"  (розбило на Gyp6 Wholesale)
  '3.' + generateAbbreviation('Ikea'), // -> "IKE" (взяло перші 3 літери)
  '4.' + generateAbbreviation('Modern Furniture'), // -> "MF"
);
