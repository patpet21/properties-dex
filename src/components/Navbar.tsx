
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  const { wallet, connect, disconnect, isLoading } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track scroll for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Create Token', path: '/create-token' },
    { name: 'List Token', path: '/list-token' },
    { name: 'Marketplace', path: '/marketplace' },
  ];

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 py-4',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg border-b border-white/5 shadow-md'
          : 'bg-transparent'
      )}
    >
      <div className="page-container flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 hover-scale"
        >
          <span className="text-xl font-bold text-gradient">PRDX</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative px-1 py-2 text-sm font-medium transition-colors',
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span>{item.name}</span>
              {location.pathname === item.path && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary animate-fade-in" />
              )}
            </Link>
          ))}
        </div>

        {/* Wallet Connection & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4">
          {/* Wallet Button */}
          {wallet.isConnected ? (
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-muted px-4 py-2 rounded-lg text-sm">
                <span className="text-xs text-muted-foreground">
                  {wallet.balance.eth.substring(0, 6)} ETH
                </span>
                <span className="text-xs text-muted-foreground">
                  {wallet.balance.prdx.substring(0, 6)} PRDX
                </span>
                <span className="text-xs text-muted-foreground">
                  {wallet.balance.usdc.substring(0, 6)} USDC
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/20 hover:bg-primary/10"
                onClick={disconnect}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {formatAddress(wallet.address || '')}
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="hidden md:flex animate-pulse"
              onClick={connect}
              disabled={isLoading}
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
          
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg border-b border-white/5 animate-fade-in">
          <div className="flex flex-col p-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
            {wallet.isConnected ? (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex justify-between items-center px-4 py-2 bg-muted rounded-md text-xs">
                  <span>{formatAddress(wallet.address || '')}</span>
                  <span>{wallet.balance.eth.substring(0, 6)} ETH</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-primary/20"
                  onClick={disconnect}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="w-full mt-2 animate-pulse"
                onClick={connect}
                disabled={isLoading}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
