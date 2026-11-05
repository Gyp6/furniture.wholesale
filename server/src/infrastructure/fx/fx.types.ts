/** One item of the NBU response: GET .../exchange?valcode=USD&json */
export interface INbuRateDto {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

export interface IExchangeRate {
  /** UAH per 1 unit of `currency`. */
  rate: number;
  currency: string;
  /** Official date of the rate (dd.mm.yyyy from NBU). */
  date: string;
}

export type TFetch = (
  input: string,
  init?: { signal?: AbortSignal },
) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;
