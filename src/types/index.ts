

// Token Creation Types
export interface TokenData {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
}

// Listing Types
export interface TokenListing {
  id: string;
  seller: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  amount: string;
  pricePerToken: string;
  paymentToken: 'PRDX' | 'USDC';
  referralActive: boolean;
  referralPercent: number;
  endTime: number;
  active: boolean;
  metadata: TokenMetadata;
}

export interface TokenMetadata {
  projectWebsite?: string;
  socialMediaLink?: string;
  tokenImageUrl?: string;
  telegramUrl?: string;
  projectDescription?: string;
}

// Wallet Types
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  provider: any;
  signer: any;
  balance: {
    eth: string;
    prdx: string;
    usdc: string;
  };
}

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  PRDX_TOKEN: "0x61Dd008F1582631Aa68645fF92a1a5ECAedBeD19",
  USDC_TOKEN: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  TOKEN_CREATOR: "0x01A3ad1acc738cb60d48E08ccadC769904De256c",
  FEE_RECIPIENT: "0x7fDECF16574bd21Fd5cce60B701D01A6F83826ab",
  MARKETPLACE: "0x0000000000000000000000000000000000000000" // Update this after deploying the marketplace contract
};

// Chain ID for Base network
export const BASE_CHAIN_ID = 8453;

