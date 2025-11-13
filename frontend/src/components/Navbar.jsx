import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useIsVerifier } from '../hooks/useContract';

const Navbar = () => {
  const location = useLocation();
  const { address, isConnected } = useAccount();
  const { data: isVerifier } = useIsVerifier(address);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-luxury-black text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🔐</span>
            <span className="text-xl font-bold text-luxury-gold">AuthentiFlux</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`hover:text-luxury-gold transition-colors ${
                isActive('/') ? 'text-luxury-gold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/verify"
              className={`hover:text-luxury-gold transition-colors ${
                isActive('/verify') ? 'text-luxury-gold' : ''
              }`}
            >
              Verify
            </Link>
            {isConnected && (
              <>
                <Link
                  to="/my-items"
                  className={`hover:text-luxury-gold transition-colors ${
                    isActive('/my-items') ? 'text-luxury-gold' : ''
                  }`}
                >
                  My Items
                </Link>
                {isVerifier && (
                  <Link
                    to="/mint"
                    className={`hover:text-luxury-gold transition-colors ${
                      isActive('/mint') ? 'text-luxury-gold' : ''
                    }`}
                  >
                    Mint
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Wallet Connect Button */}
          <div>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

