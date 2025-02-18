export interface NftType {
  identifier: string;
  collection: string;
  ticker?: string;
  timestamp: number;
  attributes: string;
  nonce: number;
  type: NftEnumType;
  name: string;
  creator: string;
  royalties: number;
  balance: string;
  uris?: string[];
  url?: string;
  thumbnailUrl?: string;
  tags?: string[];
  decimals?: number;
  owner?: string;
  supply?: string;
  isWhitelistedStorage?: boolean;
  owners?: {
    address: string;
    balance: string;
  }[];
  assets?: {
    website?: string;
    description?: string;
    status?: string;
    pngUrl?: string;
    svgUrl?: string;
  };
  metadata?: {
    description?: string;
    fileType?: string;
    fileUri?: string;
    fileName?: string;
  };
  media?: {
    url: string;
    originalUrl: string;
    thumbnailUrl: string;
    fileType: string;
    fileSize: number;
  }[];
}

export enum NftEnumType {
  NonFungibleESDT = 'NonFungibleESDT',
  SemiFungibleESDT = 'SemiFungibleESDT',
  MetaESDT = 'MetaESDT'
}
export interface MarketplaceRequirements {
  acceptedTokens: string[];
  acceptedPayments: string[];
  maximumPaymentFees: string[];
  buyerTaxPercentageDiscount: number;
  sellerTaxPercentageDiscount: number;
  buyerTaxPercentage: number;
  sellerTaxPercentage: number;
}

export interface MinterRequirements {
  antiSpamTaxValue: number;
  addressFrozen: boolean;
  frozenNonces: number[];
  contractPaused: boolean;
  userWhitelistedForMint: boolean;
  lastUserMintTime: number;
  maxRoyalties: number;
  maxSupply: number;
  minRoyalties: number;
  mintTimeLimit: number;
  numberOfMintsForUser: number;
  totalNumberOfMints: number;
  contractWhitelistEnabled: boolean;
}

export interface Offer {
  index: number;
  owner: string;
  offeredTokenIdentifier: string;
  offeredTokenNonce: number;
  offeredTokenAmount: string;
  wantedTokenIdentifier: string;
  wantedTokenNonce: number;
  wantedTokenAmount: string;
  quantity: number;
}

export interface ViewDataReturnType {
  data: any;
  contentType: string;
  error?: string;
}

export interface ContractConfiguration {
  tokenIdentifier: string;
  mintedTokens: number;
  isTaxRequired: boolean;
  isContractPaused: boolean;
  maxRoyalties: number;
  minRoyalties: number;
  mintTimeLimit: number;
  isWhitelistEnabled: boolean;
  rolesAreSet: boolean;
  claimsAddress: string;
  administratorAddress: string;
}
