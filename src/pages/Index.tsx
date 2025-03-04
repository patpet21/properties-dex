
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import TokenInfo from "@/components/TokenInfo";
import Disclaimer from "@/components/Disclaimer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Building,
  CreditCard,
  Key,
  LinkIcon,
  Lock,
  RefreshCw,
  Shield,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* Features Section */}
        <div className="w-full py-20 bg-background">
          <div className="page-container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6 text-gradient"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Revolutionizing Real Estate Investment
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Properties DEX enables fractional ownership of real estate assets through blockchain technology,
                making property investment more accessible, liquid, and transparent.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Building className="h-6 w-6 text-primary" />,
                  title: "Tokenize Properties",
                  description: "Convert real estate assets into digital tokens representing fractional ownership.",
                },
                {
                  icon: <CreditCard className="h-6 w-6 text-primary" />,
                  title: "Low Barrier to Entry",
                  description: "Invest in real estate with lower capital requirements through fractional tokens.",
                },
                {
                  icon: <BarChart3 className="h-6 w-6 text-primary" />,
                  title: "Enhanced Liquidity",
                  description: "Trade property tokens instantly without the lengthy processes of traditional real estate.",
                },
                {
                  icon: <Shield className="h-6 w-6 text-primary" />,
                  title: "Secure Transactions",
                  description: "Leverage blockchain security for transparent and tamper-proof ownership records.",
                },
                {
                  icon: <RefreshCw className="h-6 w-6 text-primary" />,
                  title: "Global Marketplace",
                  description: "Access a worldwide market of tokenized real estate assets 24/7.",
                },
                {
                  icon: <LinkIcon className="h-6 w-6 text-primary" />,
                  title: "Referral System",
                  description: "Earn rewards by referring other investors to property token listings.",
                },
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="rounded-xl border border-white/10 bg-card/50 hover:bg-card/80 transition-colors p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="w-full py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="page-container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6 text-gradient"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                How Properties DEX Works
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                Our platform simplifies the process of tokenizing and trading real estate assets
                through a secure and transparent blockchain infrastructure.
              </motion.p>
            </div>
            
            <div className="relative">
              {/* Connection line */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {[
                  {
                    step: "01",
                    title: "Create Tokens",
                    description: "Create ERC-20 tokens that represent fractional ownership of your real estate property.",
                    link: "/create-token",
                    linkText: "Create Token",
                    icon: <Key className="h-6 w-6" />,
                  },
                  {
                    step: "02",
                    title: "List on Marketplace",
                    description: "Specify token price, payment methods, and optional referral incentives.",
                    link: "/list-token",
                    linkText: "List Token",
                    icon: <Lock className="h-6 w-6" />,
                  },
                  {
                    step: "03",
                    title: "Trade & Invest",
                    description: "Browse listings, purchase tokens, and build a diversified real estate portfolio.",
                    link: "/marketplace",
                    linkText: "Visit Marketplace",
                    icon: <RefreshCw className="h-6 w-6" />,
                  },
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    className="rounded-xl border border-white/10 bg-card p-8 flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.2, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 flex-grow">
                      {step.description}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      className="mt-auto w-full justify-between border-white/10 hover:bg-white/5"
                      asChild
                    >
                      <Link to={step.link}>
                        <span className="flex items-center space-x-2">
                          <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            {step.icon}
                          </span>
                          <span>{step.linkText}</span>
                        </span>
                        <span className="text-primary">→</span>
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <TokenInfo />
        <Disclaimer />
      </main>
      
      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/10">
        <div className="page-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gradient">PRDX</span>
              <span className="text-sm text-muted-foreground">© 2023 Properties DEX. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <a 
                href="https://basescan.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Base Explorer
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
