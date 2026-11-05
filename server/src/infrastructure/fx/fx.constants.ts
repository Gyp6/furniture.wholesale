/** DI token for the HTTP function used to call the exchange-rate provider (replaced by a stub in tests). */
export const FX_FETCH = Symbol('FX_FETCH');

/** DI token for the exchange-rate client options. */
export const FX_OPTIONS = Symbol('FX_OPTIONS');

/** National Bank of Ukraine official exchange-rate API. */
export const NBU_EXCHANGE_URL =
  'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange';
