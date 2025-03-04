
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { WalletState, CONTRACT_ADDRESSES, BASE_CHAIN_ID } from '@/types';

// ERC20 ABI (minimal for balance checks)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

const initialWalletState: WalletState = {
  isConnected: false,
  address: null,
  chainId: null,
  provider: null,
  signer: null,
  balance: {
    eth: '0',
    prdx: '0',
    usdc: '0'
  }
};

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>(initialWalletState);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize provider from window.ethereum
  const initializeProvider = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        return provider;
      } catch (error) {
        console.error('Error initializing provider:', error);
        return null;
      }
    }
    return null;
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    setIsLoading(true);
    try {
      const provider = await initializeProvider();
      if (!provider) {
        toast.error('Please install MetaMask to use this application');
        setIsLoading(false);
        return;
      }

      // Request account access
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      
      // Check if connected to Base network
      if (network.chainId !== BASE_CHAIN_ID) {
        toast.error('Please connect to Base network');
        try {
          // Try to switch to Base network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
                    chainName: 'Base',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://mainnet.base.org'],
                    blockExplorerUrls: ['https://basescan.org'],
                  },
                ],
              });
            } catch (addError) {
              console.error('Error adding Base network:', addError);
            }
          }
          setIsLoading(false);
          return;
        }
      }

      // Get balances
      const ethBalance = ethers.utils.formatEther(await provider.getBalance(address));
      
      const prdxContract = new ethers.Contract(CONTRACT_ADDRESSES.PRDX_TOKEN, ERC20_ABI, provider);
      const prdxDecimals = await prdxContract.decimals();
      const prdxBalance = ethers.utils.formatUnits(await prdxContract.balanceOf(address), prdxDecimals);
      
      const usdcContract = new ethers.Contract(CONTRACT_ADDRESSES.USDC_TOKEN, ERC20_ABI, provider);
      const usdcDecimals = await usdcContract.decimals();
      const usdcBalance = ethers.utils.formatUnits(await usdcContract.balanceOf(address), usdcDecimals);

      setWalletState({
        isConnected: true,
        address,
        chainId: network.chainId,
        provider,
        signer,
        balance: {
          eth: ethBalance,
          prdx: prdxBalance,
          usdc: usdcBalance
        }
      });

      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  }, [initializeProvider]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWalletState(initialWalletState);
    toast.success('Wallet disconnected');
  }, []);

  // Refresh balances
  const refreshBalances = useCallback(async () => {
    if (!walletState.isConnected || !walletState.provider || !walletState.address) return;
    
    try {
      const ethBalance = ethers.utils.formatEther(
        await walletState.provider.getBalance(walletState.address)
      );
      
      const prdxContract = new ethers.Contract(
        CONTRACT_ADDRESSES.PRDX_TOKEN, 
        ERC20_ABI, 
        walletState.provider
      );
      const prdxDecimals = await prdxContract.decimals();
      const prdxBalance = ethers.utils.formatUnits(
        await prdxContract.balanceOf(walletState.address), 
        prdxDecimals
      );
      
      const usdcContract = new ethers.Contract(
        CONTRACT_ADDRESSES.USDC_TOKEN, 
        ERC20_ABI, 
        walletState.provider
      );
      const usdcDecimals = await usdcContract.decimals();
      const usdcBalance = ethers.utils.formatUnits(
        await usdcContract.balanceOf(walletState.address), 
        usdcDecimals
      );

      setWalletState(prev => ({
        ...prev,
        balance: {
          eth: ethBalance,
          prdx: prdxBalance,
          usdc: usdcBalance
        }
      }));
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
  }, [walletState]);

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (walletState.address !== accounts[0] && walletState.isConnected) {
          // Account changed, reconnect
          connect();
        }
      };

      const handleChainChanged = () => {
        // Chain changed, reload page as recommended by MetaMask
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [walletState, connect, disconnect]);

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      const provider = await initializeProvider();
      if (provider) {
        try {
          // Only proceed if the user has already authorized the app
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            connect();
          }
        } catch (error) {
          console.error('Auto-connect error:', error);
        }
      }
    };

    autoConnect();
  }, [initializeProvider, connect]);

  return {
    wallet: walletState,
    isLoading,
    connect,
    disconnect,
    refreshBalances
  };
}

// Add type definitions for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
