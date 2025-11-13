import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useContractInfo } from '../hooks/useAPI';

const Home = () => {
  const { isConnected } = useAccount();
  const { data: contractInfo, loading } = useContractInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Blockchain-Based
            <span className="text-luxury-gold"> Luxury Goods</span>
            <br />
            Authentication
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Immutable proof of authenticity and ownership history on the blockchain.
            Verify luxury items instantly with NFC/QR technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/verify"
              className="bg-luxury-gold hover:bg-luxury-darkGold text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Verify Item
            </Link>
            {isConnected ? (
              <Link
                to="/my-items"
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                My Items
              </Link>
            ) : (
              <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Connect Wallet to Start
              </button>
            )}
          </div>

          {/* Stats */}
          {!loading && contractInfo && (
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-bold text-luxury-gold">
                    {contractInfo.totalAuthenticatedItems}
                  </p>
                  <p className="text-gray-600">Items Authenticated</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-luxury-gold">
                    {contractInfo.symbol}
                  </p>
                  <p className="text-gray-600">NFT Symbol</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-luxury-gold">100%</p>
                  <p className="text-gray-600">Blockchain Verified</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-luxury-gold text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Physical Verification</h3>
              <p className="text-gray-600">
                Authentication partners inspect and verify luxury items using expert knowledge
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-luxury-gold text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">NFT Minting</h3>
              <p className="text-gray-600">
                Create an immutable digital passport (NFT) linked to the physical item via NFC/QR chip
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-luxury-gold text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Verification</h3>
              <p className="text-gray-600">
                Anyone can verify authenticity and view complete ownership history on the blockchain
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Immutable Records</h3>
              <p className="text-gray-600">
                Authentication data stored permanently on blockchain, impossible to alter or fake
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">📜</div>
              <h3 className="text-xl font-semibold mb-2">Complete Provenance</h3>
              <p className="text-gray-600">
                Track full ownership history with timestamps and transfer prices
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Instant Verification</h3>
              <p className="text-gray-600">
                Verify authenticity in seconds by scanning the NFC/QR chip
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="text-xl font-semibold mb-2">Trustless Transfers</h3>
              <p className="text-gray-600">
                Buy and sell with confidence - authenticity guaranteed by blockchain
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

