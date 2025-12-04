import React, { useState } from 'react';
import { useVerifyItemAPI } from '../hooks/useAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { truncateAddress, formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';

const Verify = () => {
  const [chipId, setChipId] = useState('');
  const [searchChipId, setSearchChipId] = useState('');
  const { data, loading, error } = useVerifyItemAPI(searchChipId);

  const handleSearch = (e) => {
    e.preventDefault();
    if (chipId.trim()) {
      setSearchChipId(chipId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verify Luxury Item
          </h1>
          <p className="text-gray-600">
            Enter the chip ID from your luxury item to verify its authenticity
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={chipId}
                onChange={(e) => setChipId(e.target.value)}
                placeholder="Enter Chip ID (e.g., NFC-1234567890)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              />
              <button
                type="submit"
                disabled={!chipId.trim() || loading}
                className="bg-luxury-gold hover:bg-luxury-darkGold text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Verifying item..." />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert type="error" message={error} />
        )}

        {/* Not Found State */}
        {data && !data.authenticated && !loading && (
          <Alert
            type="warning"
            message="Item not found or not authenticated. Please check the chip ID and try again."
          />
        )}

        {/* Success State */}
        {data && data.authenticated && !loading && (
          <div className="bg-white rounded-lg shadow-lg p-8 animate-fadeIn">
            {/* Success Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-100 text-green-800 px-6 py-3 rounded-full flex items-center space-x-2">
                <span className="text-2xl">✓</span>
                <span className="font-semibold text-lg">Authenticated Item</span>
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {data.details.brand} {data.details.model}
                </h2>
                <p className="text-gray-600">Token ID: #{data.tokenId}</p>
              </div>

              {/* Coin Spinning Animation with Image */}
              {data.image && (
                <div className="coin-container">
                  <div className="coin">
                    <div className="coin-face coin-front">
                      <img
                        src={data.image}
                        alt={`${data.details.brand} ${data.details.model}`}
                        className="coin-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="coin-face coin-back">
                      <img
                        src={data.image}
                        alt={`${data.details.brand} ${data.details.model}`}
                        className="coin-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    Item Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-semibold">{data.details.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-semibold">{data.details.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Serial Number:</span>
                      <span className="font-mono font-semibold">
                        {data.details.serialNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chip ID:</span>
                      <span className="font-mono font-semibold">
                        {data.details.chipId}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    Verification Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Owner:</span>
                      <span className="font-mono font-semibold">
                        {truncateAddress(data.owner)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verifier:</span>
                      <span className="font-mono font-semibold">
                        {truncateAddress(data.details.verifier)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Verified On:</span>
                      <span className="font-semibold">
                        {formatDate(data.details.verificationDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Full Details Button */}
              <div className="pt-6 border-t border-gray-200">
                <Link
                  to={`/item/${data.tokenId}`}
                  className="block w-full bg-luxury-gold hover:bg-luxury-darkGold text-white text-center font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  View Full Details & History
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        {!searchChipId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-blue-900 mb-2">How to find your Chip ID</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Look for the NFC/QR chip attached to your luxury item</li>
              <li>• The Chip ID is usually printed below the QR code</li>
              <li>• Format: NFC-XXXXXXXXXX or similar</li>
              <li>• You can also scan the QR code to get the Chip ID</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;

