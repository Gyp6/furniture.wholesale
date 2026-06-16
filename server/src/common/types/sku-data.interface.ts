export interface ISkuDataInput {
  name: string;
  price: number;
  sequence: number;
  manufacturerCode: string;
}

export interface IDecodedSku {
  company: string;
  dataHash: string;
  sequence: number;
  manufacturerCode: string;
}
