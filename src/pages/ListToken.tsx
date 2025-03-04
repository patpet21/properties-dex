
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CONTRACT_ADDRESSES } from '@/types';

// Form schema
const listingFormSchema = z.object({
  tokenAddress: z.string().min(42, 'Enter a valid token address'),
  amount: z.string().min(1, 'Amount is required'),
  pricePerToken: z.string().min(1, 'Price is required'),
  paymentToken: z.enum(['PRDX', 'USDC']),
  duration: z.number().min(1).max(90),
  referralActive: z.boolean().default(false),
  referralPercent: z.number().min(1).max(100).default(5),
  projectWebsite: z.string().url('Enter a valid URL').max(256).optional().or(z.literal('')),
  socialMediaLink: z.string().url('Enter a valid URL').max(256).optional().or(z.literal('')),
  tokenImageUrl: z.string().url('Enter a valid URL').max(256).optional().or(z.literal('')),
  telegramUrl: z.string().url('Enter a valid URL').max(256).optional().or(z.literal('')),
  projectDescription: z.string().max(1024).optional(),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

const ListToken = () => {
  const navigate = useNavigate();
  const { wallet, isLoading } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      tokenAddress: '',
      amount: '',
      pricePerToken: '',
      paymentToken: 'PRDX',
      duration: 30,
      referralActive: false,
      referralPercent: 5,
      projectWebsite: '',
      socialMediaLink: '',
      tokenImageUrl: '',
      telegramUrl: '',
      projectDescription: '',
    },
  });

  const onSubmit = async (values: ListingFormValues) => {
    if (!wallet.isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // This is a placeholder - in a real app, you would interact with the marketplace contract
      console.log('Listing values:', values);
      
      // Simulate a delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Token listed successfully!');
      navigate('/marketplace');
    } catch (error) {
      console.error('Error listing token:', error);
      toast.error('Failed to list token. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch referralActive to conditionally show/hide referral percentage
  const referralActive = form.watch('referralActive');

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
            <h1 className="text-3xl font-bold mb-2">List Your Property Token</h1>
            <p className="text-muted-foreground">
              Make your property token available on the marketplace
            </p>
          </motion.div>
          
          {!wallet.isConnected ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <p className="mb-4">Connect your wallet to list tokens on the marketplace</p>
                <Button onClick={() => wallet.connect} disabled={isLoading}>
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Token Details</CardTitle>
                      <CardDescription>
                        Enter the details of the token you want to list
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="tokenAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Token Address</FormLabel>
                            <FormControl>
                              <Input placeholder="0x..." {...field} />
                            </FormControl>
                            <FormDescription>
                              The address of your ERC-20 token
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount to List</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                              <FormDescription>
                                How many tokens to list
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="pricePerToken"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price Per Token</FormLabel>
                              <FormControl>
                                <Input type="number" min="0.000001" step="0.000001" {...field} />
                              </FormControl>
                              <FormDescription>
                                Price in selected payment token
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="paymentToken"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Token</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment token" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="PRDX">PRDX (Properties DEX Token)</SelectItem>
                                  <SelectItem value="USDC">USDC</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Token you want to receive as payment
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Listing Duration: {field.value} days</FormLabel>
                              <FormControl>
                                <Slider 
                                  min={1} 
                                  max={90} 
                                  step={1} 
                                  defaultValue={[field.value]} 
                                  onValueChange={(vals) => field.onChange(vals[0])}
                                />
                              </FormControl>
                              <FormDescription>
                                How long to keep the listing active
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Referral System</CardTitle>
                      <CardDescription>
                        Enable referrals to incentivize others to promote your listing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="referralActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Enable Referral System
                              </FormLabel>
                              <FormDescription>
                                Allow others to earn a percentage when someone buys through their referral link
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {referralActive && (
                        <FormField
                          control={form.control}
                          name="referralPercent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Referral Percentage: {field.value}%</FormLabel>
                              <FormControl>
                                <Slider 
                                  min={1} 
                                  max={100} 
                                  step={1} 
                                  defaultValue={[field.value]} 
                                  onValueChange={(vals) => field.onChange(vals[0])}
                                />
                              </FormControl>
                              <FormDescription>
                                Percentage of the sale that goes to the referrer
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Token Metadata</CardTitle>
                      <CardDescription>
                        Add additional information about your property token (optional)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="projectWebsite"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Website</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="socialMediaLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Social Media Link</FormLabel>
                              <FormControl>
                                <Input placeholder="https://twitter.com/..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="tokenImageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Token Image URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="telegramUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telegram URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://t.me/..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="projectDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your property token..." 
                                className="min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum 1024 characters
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Listing...' : 'List Token'}
                      </Button>
                    </CardFooter>
                  </Card>
                </form>
              </Form>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ListToken;
