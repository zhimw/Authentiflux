import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useItemDetailsAPI, useTransferHistoryAPI } from '../hooks/useAPI';
import { useContractWrite } from '../hooks/useContract';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import { parseEther } from 'viem';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { truncateAddress, formatDate, formatEth, copyToClipboard } from '../utils/helpers';

const ItemDetail = () => {
  const { tokenId } = useParams();
  const { address } = useAccount();
  const { data: itemData, loading: itemLoading } = useItemDetailsAPI(tokenId);
  const { data: historyData, loading: historyLoading } = useTransferHistoryAPI(tokenId);

  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferTo, setTransferTo] = useState('');
  const [transferPrice, setTransferPrice] = useState('');
  const [transferResult, setTransferResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const { writeContract, isPending, isConfirming, isConfirmed, error } = useContractWrite();

  const isOwner = itemData?.owner?.toLowerCase() === address?.toLowerCase();

  const handleCopy = async (text) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!address || !isOwner) {
      setTransferResult({
        success: false,
        error: 'You must be the owner to transfer this item'
      });
      return;
    }

    if (!transferTo) {
      setTransferResult({
        success: false,
        error: 'Please enter a recipient address'
      });
      return;
    }

    setTransferResult(null);

    try {
      const priceInWei = transferPrice ? parseEther(transferPrice) : 0n;
      // eslint-disable-next-line no-undef
      const tokenIdBigInt = BigInt(tokenId);
      
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'transferWithPrice',
        args: [address, transferTo, tokenIdBigInt, priceInWei],
      });
    } catch (err) {
      setTransferResult({
        success: false,
        error: err.message || 'Failed to initiate transfer'
      });
    }
  };

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      setTransferResult({
        success: true,
        message: 'Transfer successful!'
      });
      setShowTransferForm(false);
      setTransferTo('');
      setTransferPrice('');
      // Refresh page after 2 seconds
      setTimeout(() => window.location.reload(), 2000);
    }
  }, [isConfirmed]);

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      setTransferResult({
        success: false,
        error: error.message || 'Transaction failed'
      });
    }
  }, [error]);

  if (itemLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex justify-center">
        <LoadingSpinner size="lg" text="Loading item details..." />
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert type="error" message="Item not found" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link
          to="/my-items"
          className="inline-flex items-center text-luxury-gold hover:text-luxury-darkGold mb-6"
        >
          ← Back to My Items
        </Link>

        {/* Item Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {itemData.details.brand} {itemData.details.model}
              </h1>
              <p className="text-gray-600">Token ID: #{tokenId}</p>
            </div>
            <span className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full">
              ✓ Authenticated
            </span>
          </div>

          {/* Item Image */}
          {itemData.image && (
            <div className="mb-8 rounded-lg overflow-hidden bg-gray-100 max-w-2xl">
              <img
                src={itemData.image}
                alt={`${itemData.details.brand} ${itemData.details.model}`}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Item Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Brand</span>
                  <p className="font-semibold">{itemData.details.brand}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Model</span>
                  <p className="font-semibold">{itemData.details.model}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Serial Number</span>
                  <p className="font-mono font-semibold">
                    {itemData.details.serialNumber}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Chip ID</span>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono font-semibold">
                      {itemData.details.chipId}
                    </p>
                    <button
                      onClick={() => handleCopy(itemData.details.chipId)}
                      className="text-luxury-gold hover:text-luxury-darkGold text-sm"
                    >
                      {copied ? '✓' : '📋'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ownership & Verification
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500 text-sm">Current Owner</span>
                  <p className="font-mono font-semibold">
                    {truncateAddress(itemData.owner)}
                    {isOwner && (
                      <span className="ml-2 text-luxury-gold text-sm">(You)</span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Verified By</span>
                  <p className="font-mono font-semibold">
                    {truncateAddress(itemData.details.verifier)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Verification Date</span>
                  <p className="font-semibold">
                    {formatDate(itemData.details.verificationDate)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Status</span>
                  <p className="font-semibold text-green-600">
                    {itemData.details.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Button */}
          {isOwner && !showTransferForm && (
            <button
              onClick={() => setShowTransferForm(true)}
              className="w-full bg-luxury-gold hover:bg-luxury-darkGold text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Transfer Item
            </button>
          )}

          {/* Transfer Form */}
          {showTransferForm && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Transfer Item
              </h3>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="0x..."
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price (ETH) - Optional
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={transferPrice}
                    onChange={(e) => setTransferPrice(e.target.value)}
                    placeholder="0.0 (leave empty for gift)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isPending || isConfirming}
                    className="flex-1 bg-luxury-gold hover:bg-luxury-darkGold text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isPending ? 'Waiting for wallet...' : isConfirming ? 'Confirming...' : 'Confirm Transfer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTransferForm(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {transferResult && (
                <div className="mt-4">
                  <Alert
                    type={transferResult.success ? 'success' : 'error'}
                    message={
                      transferResult.success
                        ? 'Transfer successful!'
                        : transferResult.error
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Transfer History */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Transfer History
          </h2>

          {historyLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner text="Loading history..." />
            </div>
          )}

          {!historyLoading && historyData && (
            <div className="space-y-4">
              {historyData.history.map((record, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-luxury-gold transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-luxury-gold text-white text-xs font-semibold px-2 py-1 rounded">
                          #{record.transferNumber}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatDate(record.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="font-mono">{truncateAddress(record.from)}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-mono">{truncateAddress(record.to)}</span>
                      </div>
                    </div>
                    {record.price !== '0.0' && (
                      <div className="text-right">
                        <p className="text-lg font-bold text-luxury-gold">
                          {formatEth(record.price)} ETH
                        </p>
                        <p className="text-xs text-gray-500">Sale Price</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;

