
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONTRACT_ADDRESSES } from '@/types';
import { useState } from 'react';
import { motion } from 'framer-motion';

const TokenInfo = () => {
  const [prdxCopied, setPrdxCopied] = useState(false);
  const [usdcCopied, setUsdcCopied] = useState(false);

  const copyToClipboard = (text: string, type: 'prdx' | 'usdc') => {
    navigator.clipboard.writeText(text);
    if (type === 'prdx') {
      setPrdxCopied(true);
      setTimeout(() => setPrdxCopied(false), 2000);
    } else {
      setUsdcCopied(true);
      setTimeout(() => setUsdcCopied(false), 2000);
    }
  };

  return (
    <div className="w-full py-20">
      <div className="page-container">
        <motion.div 
          className="w-full rounded-2xl glass-morphism p-6 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2">
              <h2 className="text-2xl font-bold text-gradient">Token Information</h2>
              <p className="text-muted-foreground">
                Properties DEX uses two main tokens for its operations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PRDX Token Card */}
              <div className="flex flex-col rounded-xl border border-white/10 bg-card/50 hover:bg-card/80 transition-colors p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">P</span>
                    </div>
                    <div>
                      <h3 className="font-bold">PRDX Token</h3>
                      <p className="text-xs text-muted-foreground">Platform Governance Token</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => window.open(`https://basescan.org/token/${CONTRACT_ADDRESSES.PRDX_TOKEN}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="text-xs text-muted-foreground">Token Address</div>
                  <div className="flex items-center justify-between bg-background/50 rounded-lg p-2 pr-1 text-sm">
                    <div className="truncate font-mono text-xs">
                      {CONTRACT_ADDRESSES.PRDX_TOKEN}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyToClipboard(CONTRACT_ADDRESSES.PRDX_TOKEN, 'prdx')}
                    >
                      {prdxCopied ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="text-xs text-muted-foreground">Details</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-background/50 rounded-lg p-2 text-sm">
                      <div className="text-xs text-muted-foreground">Network</div>
                      <div>Base</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 text-sm">
                      <div className="text-xs text-muted-foreground">Decimals</div>
                      <div>18</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-primary/20 text-primary hover:bg-primary/10"
                    onClick={() => window.open(`https://app.uniswap.org/swap?outputCurrency=${CONTRACT_ADDRESSES.PRDX_TOKEN}&chain=base`, '_blank')}
                  >
                    Buy on Uniswap
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* USDC Token Card */}
              <div className="flex flex-col rounded-xl border border-white/10 bg-card/50 hover:bg-card/80 transition-colors p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-500 font-bold">$</span>
                    </div>
                    <div>
                      <h3 className="font-bold">USDC Token</h3>
                      <p className="text-xs text-muted-foreground">USD Stablecoin</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => window.open(`https://basescan.org/token/${CONTRACT_ADDRESSES.USDC_TOKEN}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="text-xs text-muted-foreground">Token Address</div>
                  <div className="flex items-center justify-between bg-background/50 rounded-lg p-2 pr-1 text-sm">
                    <div className="truncate font-mono text-xs">
                      {CONTRACT_ADDRESSES.USDC_TOKEN}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyToClipboard(CONTRACT_ADDRESSES.USDC_TOKEN, 'usdc')}
                    >
                      {usdcCopied ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="text-xs text-muted-foreground">Details</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-background/50 rounded-lg p-2 text-sm">
                      <div className="text-xs text-muted-foreground">Network</div>
                      <div>Base</div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 text-sm">
                      <div className="text-xs text-muted-foreground">Decimals</div>
                      <div>6</div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-green-500/20 text-green-500 hover:bg-green-500/10"
                    onClick={() => window.open(`https://app.uniswap.org/swap?outputCurrency=${CONTRACT_ADDRESSES.USDC_TOKEN}&chain=base`, '_blank')}
                  >
                    Buy on Uniswap
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TokenInfo;
