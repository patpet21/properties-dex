
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CONTRACT_ADDRESSES } from '@/types';
import { AlertCircle } from 'lucide-react';

// ABI for token creator contract (minimal interface)
const TOKEN_CREATOR_ABI = [
  "function createToken(string name, string symbol, uint256 totalSupply, uint8 decimals) external returns (address)"
];

// Form schema
const createTokenSchema = z.object({
  name: z.string().min(1, 'Token name is required').max(64, 'Token name is too long'),
  symbol: z.string().min(1, 'Token symbol is required').max(10, 'Token symbol is too long'),
  totalSupply: z.string().min(1, 'Total supply is required'),
  decimals: z.number().min(0).max(18),
});

type CreateTokenFormValues = z.infer<typeof createTokenSchema>;

const CreateToken = () => {
  const { wallet, isLoading, connect } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [createdTokenAddress, setCreatedTokenAddress] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Initialize form with default values
  const form = useForm<CreateTokenFormValues>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      name: '',
      symbol: '',
      totalSupply: '',
      decimals: 18,
    },
  });

  const onSubmit = async (values: CreateTokenFormValues) => {
    if (!wallet.isConnected || !wallet.signer) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsCreating(true);
    
    try {
      const tokenCreator = new ethers.Contract(
        CONTRACT_ADDRESSES.TOKEN_CREATOR,
        TOKEN_CREATOR_ABI,
        wallet.signer
      );
      
      // Convert totalSupply to wei based on decimals
      const totalSupplyInWei = ethers.utils.parseUnits(values.totalSupply, values.decimals);
      
      // This is a simulation since we don't have the actual contract deployed
      // In a real app, this would call the contract method
      console.log('Creating token with params:', {
        name: values.name,
        symbol: values.symbol,
        totalSupply: totalSupplyInWei.toString(),
        decimals: values.decimals,
      });
      
      // Simulate contract interaction for demo
      if (process.env.NODE_ENV === 'development') {
        // Simulate a successful transaction for demonstration
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate random address and transaction hash for demo
        const demoTokenAddress = `0x${Array(40).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const demoTxHash = `0x${Array(64).fill(0).map(() => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`;
          
        setCreatedTokenAddress(demoTokenAddress);
        setTransactionHash(demoTxHash);
        
        // In production, use actual contract call:
        // const tx = await tokenCreator.createToken(
        //   values.name,
        //   values.symbol,
        //   totalSupplyInWei,
        //   values.decimals
        // );
        // const receipt = await tx.wait();
        // setCreatedTokenAddress(receipt.events[0].args.tokenAddress);
        // setTransactionHash(receipt.transactionHash);
        
        toast.success('Token created successfully!');
      }
    } catch (error) {
      console.error('Error creating token:', error);
      toast.error('Failed to create token. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="page-container py-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Create Property Token</h1>
            <p className="text-muted-foreground">
              Tokenize your real estate asset with a custom ERC-20 token
            </p>
          </motion.div>
          
          {!wallet.isConnected ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <p className="mb-4">Connect your wallet to create property tokens</p>
                <Button onClick={connect} disabled={isLoading}>
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </CardContent>
            </Card>
          ) : createdTokenAddress ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-center text-primary">Token Created Successfully!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-background p-4 border space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token Address:</span>
                      <span className="font-mono font-medium">{createdTokenAddress}</span>
                    </div>
                    {transactionHash && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transaction:</span>
                        <a 
                          href={`https://basescan.org/tx/${transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-primary hover:underline truncate max-w-[250px]"
                        >
                          {transactionHash}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => window.navigator.clipboard.writeText(createdTokenAddress)}
                  >
                    Copy Token Address
                  </Button>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      form.reset();
                      setCreatedTokenAddress(null);
                      setTransactionHash(null);
                    }}
                  >
                    Create Another Token
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Token Details</CardTitle>
                  <CardDescription>
                    Customize your property token parameters
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                      <Alert className="bg-yellow-900/20 text-yellow-600 border-yellow-600/40">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          Creating a token requires a transaction on Base network. Make sure your wallet has enough ETH for gas fees.
                        </AlertDescription>
                      </Alert>
                      
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Miami Beach Property" {...field} />
                            </FormControl>
                            <FormDescription>
                              The full name of your property token
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="symbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token Symbol</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. MBP" {...field} />
                            </FormControl>
                            <FormDescription>
                              A short abbreviation for your token (3-5 characters recommended)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="totalSupply"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Supply</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" placeholder="e.g. 1000000" {...field} />
                              </FormControl>
                              <FormDescription>
                                The maximum number of tokens that will exist
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="decimals"
                          render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                              <FormLabel>Decimals</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  max="18" 
                                  placeholder="e.g. 18" 
                                  onChange={e => onChange(parseInt(e.target.value))} 
                                  value={value} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                How divisible your token will be (0-18, 18 recommended)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={isCreating}>
                        {isCreating ? 'Creating Token...' : 'Create Token'}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateToken;
