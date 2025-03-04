
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, FilterIcon, TagIcon } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

// This is a placeholder until we connect to the actual marketplace contract
const dummyListings = [
  {
    id: '1',
    tokenName: 'Beach Villa Token',
    tokenSymbol: 'BVT',
    tokenAddress: '0x1234...5678',
    amount: '100000',
    pricePerToken: '0.01',
    paymentToken: 'PRDX',
    seller: '0xabcd...1234',
    referralActive: true,
    referralPercent: 5,
    endTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    metadata: {
      projectDescription: 'Luxury beach villa in Miami with ocean view',
      projectWebsite: 'https://beachvilla.example.com',
      tokenImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
      telegramUrl: 'https://t.me/beachvilla',
      socialMediaLink: 'https://twitter.com/beachvilla',
    }
  },
  {
    id: '2',
    tokenName: 'Downtown Apartment',
    tokenSymbol: 'DAT',
    tokenAddress: '0x2345...6789',
    amount: '50000',
    pricePerToken: '0.05',
    paymentToken: 'USDC',
    seller: '0xbcde...2345',
    referralActive: false,
    referralPercent: 0,
    endTime: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days from now
    metadata: {
      projectDescription: 'Modern apartment in the heart of New York City',
      projectWebsite: 'https://downtownapt.example.com',
      tokenImageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
      telegramUrl: 'https://t.me/downtownapt',
      socialMediaLink: 'https://twitter.com/downtownapt',
    }
  },
  {
    id: '3',
    tokenName: 'Commercial Office Space',
    tokenSymbol: 'COS',
    tokenAddress: '0x3456...7890',
    amount: '200000',
    pricePerToken: '0.02',
    paymentToken: 'PRDX',
    seller: '0xcdef...3456',
    referralActive: true,
    referralPercent: 3,
    endTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
    metadata: {
      projectDescription: 'Premium office space in the financial district',
      projectWebsite: 'https://officespace.example.com',
      tokenImageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
      telegramUrl: 'https://t.me/officespace',
      socialMediaLink: 'https://twitter.com/officespace',
    }
  },
];

const Marketplace = () => {
  const { wallet } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Filtered and sorted listings
  const filteredListings = dummyListings.filter(listing => {
    // Filter by search term
    if (searchTerm && !listing.tokenName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by payment token
    if (paymentFilter !== 'all' && listing.paymentToken !== paymentFilter) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === 'referral' && !listing.referralActive) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected option
    if (sortBy === 'priceAsc') {
      return parseFloat(a.pricePerToken) - parseFloat(b.pricePerToken);
    } else if (sortBy === 'priceDesc') {
      return parseFloat(b.pricePerToken) - parseFloat(a.pricePerToken);
    } else if (sortBy === 'newest') {
      return b.endTime - a.endTime; // Using endTime as a proxy for creation time
    }
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="page-container py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2">Property Token Marketplace</h1>
            <p className="text-muted-foreground mb-8">
              Browse and purchase tokenized property assets from around the world
            </p>
          </motion.div>
          
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search by token name..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Payment Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tokens</SelectItem>
                  <SelectItem value="PRDX">PRDX Only</SelectItem>
                  <SelectItem value="USDC">USDC Only</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                  <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Listings</TabsTrigger>
              <TabsTrigger value="referral">With Referral</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col">
                    {/* Image */}
                    {listing.metadata.tokenImageUrl && (
                      <div className="aspect-[16/9] relative overflow-hidden">
                        <img 
                          src={listing.metadata.tokenImageUrl} 
                          alt={listing.tokenName} 
                          className="object-cover w-full h-full"
                        />
                        {listing.referralActive && (
                          <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full">
                            {listing.referralPercent}% Referral
                          </div>
                        )}
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{listing.tokenName}</CardTitle>
                          <CardDescription>Symbol: {listing.tokenSymbol}</CardDescription>
                        </div>
                        <div className="bg-muted px-2 py-1 rounded text-sm font-medium">
                          {listing.paymentToken}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Available Amount</p>
                          <p className="font-medium">{parseInt(listing.amount).toLocaleString()} tokens</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Price Per Token</p>
                          <p className="text-xl font-bold">
                            {listing.pricePerToken} {listing.paymentToken}
                          </p>
                        </div>
                        
                        {listing.metadata.projectDescription && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Description</p>
                            <p className="text-sm line-clamp-2">{listing.metadata.projectDescription}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-3 border-t pt-4">
                      <div className="flex gap-2 text-xs text-muted-foreground w-full">
                        {listing.metadata.projectWebsite && (
                          <a 
                            href={listing.metadata.projectWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            Website
                          </a>
                        )}
                        {listing.metadata.socialMediaLink && (
                          <a 
                            href={listing.metadata.socialMediaLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            Twitter
                          </a>
                        )}
                        {listing.metadata.telegramUrl && (
                          <a 
                            href={listing.metadata.telegramUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary"
                          >
                            Telegram
                          </a>
                        )}
                      </div>
                      
                      <Button className="w-full" disabled={!wallet.isConnected}>
                        {wallet.isConnected ? "Purchase Tokens" : "Connect Wallet to Purchase"}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No listings found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Marketplace;
