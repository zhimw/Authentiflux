import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useIsVerifier } from '../hooks/useContract';
import { mintItem } from '../hooks/useAPI';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const Mint = () => {
  const { address, isConnected } = useAccount();
  const { data: isVerifier, isLoading: checkingVerifier } = useIsVerifier(address);

  const [formData, setFormData] = useState({
    owner: '',
    brand: '',
    model: '',
    serialNumber: '',
    chipId: '',
  });

  const [minting, setMinting] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMinting(true);
    setResult(null);

    const mintResult = await mintItem(formData);
    setResult(mintResult);
    setMinting(false);

    if (mintResult.success) {
      // Reset form
      setFormData({
        owner: '',
        brand: '',
        model: '',
        serialNumber: '',
        chipId: '',
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert
            type="warning"
            message="Please connect your wallet to access the minting page."
          />
        </div>
      </div>
    );
  }

  if (checkingVerifier) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex justify-center">
        <LoadingSpinner size="lg" text="Checking authorization..." />
      </div>
    );
  }

  if (!isVerifier) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert
            type="error"
            message="You are not authorized to mint items. Only authorized verifiers can mint NFTs."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mint Authenticated Item
          </h1>
          <p className="text-gray-600">
            Create a new NFT for a verified luxury item
          </p>
        </div>

        {/* Verifier Badge */}
        <div className="bg-luxury-gold bg-opacity-10 border border-luxury-gold rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-semibold text-luxury-darkGold">
                Authorized Verifier
              </p>
              <p className="text-sm text-gray-600">
                You have permission to mint authenticated items
              </p>
            </div>
          </div>
        </div>

        {/* Mint Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Owner Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Address *
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="0x..."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                The wallet address of the item owner
              </p>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g., Louis Vuitton"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., Neverfull MM"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number *
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="e.g., FL4198"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              />
            </div>

            {/* Chip ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chip ID *
              </label>
              <input
                type="text"
                name="chipId"
                value={formData.chipId}
                onChange={handleChange}
                placeholder="e.g., NFC-1234567890"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
              />
              <p className="text-xs text-gray-500 mt-1">
                Unique identifier from the NFC/QR chip
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={minting}
              className="w-full bg-luxury-gold hover:bg-luxury-darkGold text-white font-semibold px-6 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {minting ? (
                <span className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>Minting...</span>
                </span>
              ) : (
                'Mint NFT'
              )}
            </button>
          </form>

          {/* Result Message */}
          {result && (
            <div className="mt-6">
              <Alert
                type={result.success ? 'success' : 'error'}
                message={
                  result.success
                    ? `Successfully minted! Token ID: ${result.data.tokenId}`
                    : result.error
                }
                onClose={() => setResult(null)}
              />
              {result.success && result.data.transactionHash && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Transaction Hash:</p>
                  <p className="font-mono text-xs break-all">
                    {result.data.transactionHash}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-blue-900 mb-2">Minting Guidelines</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Ensure the item has been physically verified for authenticity</li>
            <li>• Attach an NFC/QR chip to the item before minting</li>
            <li>• Each chip ID must be unique - duplicates will be rejected</li>
            <li>• Double-check all information before submitting</li>
            <li>• The transaction will be recorded permanently on the blockchain</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mint;

