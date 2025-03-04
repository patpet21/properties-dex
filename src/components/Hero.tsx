
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';

const Hero = () => {
  const { wallet, connect } = useWallet();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateParallax = (depth: number = 20) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const moveX = (mousePosition.x - centerX) / depth;
    const moveY = (mousePosition.y - centerY) / depth;
    
    return {
      x: moveX,
      y: moveY,
    };
  };

  // Content animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-20 left-[10%] w-[40vmax] h-[40vmax] rounded-full bg-primary/5 blur-[120px]"
          style={{ 
            transform: `translate(${calculateParallax(40).x}px, ${calculateParallax(40).y}px)` 
          }}
        />
        <div 
          className="absolute bottom-20 right-[10%] w-[30vmax] h-[30vmax] rounded-full bg-secondary/5 blur-[100px]"
          style={{ 
            transform: `translate(${calculateParallax(30).x}px, ${calculateParallax(30).y}px)` 
          }}
        />
      </div>
      
      {/* Grid lines */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{ 
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: `translate(${calculateParallax(60).x}px, ${calculateParallax(60).y}px)` 
        }}
      />
      
      <div className="relative z-10 page-container">
        <motion.div 
          className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow text */}
          <motion.div variants={itemVariants}>
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              REAL ESTATE TOKENIZATION ON BASE
            </span>
          </motion.div>
          
          {/* Main title */}
          <motion.h1 
            variants={itemVariants}
            className="text-gradient text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            Properties DEX <span className="text-primary">(PRDX)</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl"
          >
            The first decentralized exchange for tokenized real estate on the Base network.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            {!wallet.isConnected ? (
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-primary to-primary-600 hover:opacity-90 shadow-lg"
                onClick={connect}
              >
                Connect Wallet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-primary to-primary-600 hover:opacity-90 shadow-lg"
                asChild
              >
                <Link to="/marketplace">
                  Browse Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[200px] border-white/10 bg-white/5 hover:bg-white/10"
              asChild
            >
              <Link to="/create-token">
                Create Token
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
