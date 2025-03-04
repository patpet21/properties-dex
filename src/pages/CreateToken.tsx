
import { useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import { useWallet } from "@/hooks/useWallet";
import { CONTRACT_ADDRESSES, TokenData } from "@/types";

// ABI for the token creator contract
const TOKEN_CREATOR_ABI = [
  "function createToken(string name, string symbol, uint256 totalSupply, uint8 decimals) returns (address tokenAddress)"
];

const CreateToken = () => {
  const navigate = useNavigate();
  const { wallet } = useWallet();
  const [tokenData, setTokenData] = useState<TokenData>({
    name: "",
    symbol: "",
    totalSupply: "",
    decimals: 18
  });
  const [isCreating, setIsCreating] = useState(false);
  const [newTokenAddress, setNewTokenAddress] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setTokenData((prev) => ({
      ...prev,
      [name]: name === "decimals" ? parseInt(value) || 0 : value
    }));
  };

  // Validate form inputs
  const validateForm = (): boolean => {
    if (!tokenData.name) {
      toast.error("Token name is required");
      return false;
    }
    
    if (!tokenData.symbol) {
      toast.error("Token symbol is required");
      return false;
    }
    
    if (!tokenData.totalSupply || parseFloat(tokenData.totalSupply) <= 0) {
      toast.error("Total supply must be greater than 0");
      return false;
    }
    
    if (tokenData.decimals < 0 || tokenData.decimals > 18) {
      toast.error("Decimals must be between 0 and 18");
      return false;
    }
    
    return true;
  };

  // Create token
  const createToken = async () => {
    if (!wallet.isConnected || !wallet.signer) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!validateForm()) return;
    
    setIsCreating(true);
    
    try {
      const tokenCreatorContract = new ethers.Contract(
        CONTRACT_ADDRESSES.TOKEN_CREATOR,
        TOKEN_CREATOR_ABI,
        wallet.signer
      );
      
      // Convert total supply to wei amount based on decimals
      const totalSupplyWei = ethers.utils.parseUnits(tokenData.totalSupply, tokenData.decimals);
      
      // Call the createToken function
      const tx = await tokenCreatorContract.createToken(
        tokenData.name,
        tokenData.symbol,
        totalSupplyWei,
        tokenData.decimals
      );
      
      // Show pending toast
      toast.loading("Creating token, please wait for the transaction to be confirmed...");
      
      // Wait for transaction to be confirmed
      const receipt = await tx.wait();
      
      // Find the event that contains the new token address
      const events = receipt.events || [];
      const tokenCreatedEvent = events.find(
        (e: any) => e.event === "TokenCreated" || e.eventSignature?.includes("TokenCreated")
      );
      
      // Get the token address from the event
      let tokenAddress = "";
      if (tokenCreatedEvent && tokenCreatedEvent.args) {
        tokenAddress = tokenCreatedEvent.args.tokenAddress || tokenCreatedEvent.args[0];
      }
      
      // Dismiss the loading toast
      toast.dismiss();
      
      if (tokenAddress) {
        // Success: save the token address
        setNewTokenAddress(tokenAddress);
        toast.success("Token created successfully!");
      } else {
        // If we couldn't find the token address in events
        toast.success("Transaction confirmed, but couldn't retrieve token address");
      }
    } catch (error: any) {
      console.error("Error creating token:", error);
      toast.error(error.message || "Failed to create token");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="page-container max-w-3xl">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-card p-8"
          >
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gradient mb-2">Create Token</h1>
              <p className="text-muted-foreground">
                Create an ERC-20 token to represent your real estate property
              </p>
            </div>
            
            {newTokenAddress ? (
              // Success state
              <div className="space-y-6">
                <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Token Created Successfully!</h2>
                  <p className="text-muted-foreground mb-4">
                    Your token has been created and is now ready to be listed on the marketplace.
                  </p>
                  
                  <div className="w-full bg-card/50 rounded-lg p-4 mb-6">
                    <div className="text-sm mb-2 text-muted-foreground">Token Address:</div>
                    <div className="font-mono text-sm break-all">{newTokenAddress}</div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button
                      className="flex-1"
                      onClick={() => window.open(`https://basescan.org/token/${newTokenAddress}`, '_blank')}
                    >
                      View on Block Explorer
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigate('/list-token', { 
                          state: { 
                            tokenAddress: newTokenAddress,
                            tokenName: tokenData.name,
                            tokenSymbol: tokenData.symbol,
                            tokenDecimals: tokenData.decimals
                          } 
                        });
                      }}
                    >
                      List This Token
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setNewTokenAddress(null);
                      setTokenData({
                        name: "",
                        symbol: "",
                        totalSupply: "",
                        decimals: 18
                      });
                    }}
                  >
                    Create Another Token
                  </Button>
                </div>
              </div>
            ) : (
              // Create token form
              <div className="space-y-6">
                {!wallet.isConnected && (
                  <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 mb-6">
                    <p className="text-yellow-500 text-sm">
                      Please connect your wallet to create a token.
                    </p>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center">
                      Token Name
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80">
                              The full name of your token, e.g., "Luxury Apartment Complex Token"
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Luxury Apartment Complex Token"
                      value={tokenData.name}
                      onChange={handleInputChange}
                      maxLength={50}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="symbol" className="flex items-center">
                      Token Symbol
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              A short abbreviation for your token, typically 3-5 characters, e.g., "LAPT"
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="symbol"
                      name="symbol"
                      placeholder="e.g., LAPT"
                      value={tokenData.symbol}
                      onChange={handleInputChange}
                      maxLength={8}
                      className="uppercase"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="totalSupply" className="flex items-center">
                      Total Supply
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80">
                              The total number of tokens to create. This represents the total fractional units of your property.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="totalSupply"
                      name="totalSupply"
                      type="number"
                      placeholder="e.g., 1000000"
                      value={tokenData.totalSupply}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="decimals" className="flex items-center">
                      Decimals
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80">
                              The number of decimal places for your token. Standard is 18, similar to ETH. 
                              Fewer decimals (e.g., 0) means tokens can't be divided into smaller units.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="decimals"
                      name="decimals"
                      type="number"
                      placeholder="18"
                      value={tokenData.decimals}
                      onChange={handleInputChange}
                      min="0"
                      max="18"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={createToken}
                    disabled={isCreating || !wallet.isConnected}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Token...
                      </>
                    ) : (
                      "Create Token"
                    )}
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground pt-4">
                  <p>
                    Note: Creating a token requires a transaction on the Base network. Make sure you have enough ETH to cover gas fees.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CreateToken;
