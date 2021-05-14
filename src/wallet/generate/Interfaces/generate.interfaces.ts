export interface GenerateAddress {
  seed: string;
  list: Item[];
}

export interface Item {
  coinType: string;
  privateKey: string;
  publicKey: string;
  address: string;
}

