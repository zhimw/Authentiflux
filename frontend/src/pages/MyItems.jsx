import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const MyItems = () => {
  const { address, isConnected } = useAccount();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get user's NFT balance
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  // Get total supply to iterate through tokens
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTotalAuthenticatedItems',
  });

  useEffect(() => {
    const fetchUserItems = async () => {
      if (!address || !totalSupply) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userItems = [];
        const total = Number(totalSupply);

        // Iterate through all tokens to find user's items
        // Note: This is not optimal for large numbers of tokens
        // In production, you'd use The Graph or an indexer
        for (let i = 1; i <= total; i++) {
          try {
            // Check owner of each token
            const ownerResponse = await fetch(
              `http://localhost:3000/api/items/${i}`
            );
            const itemData = await ownerResponse.json();

            if (itemData.owner?.toLowerCase() === address.toLowerCase()) {
              userItems.push({
                tokenId: i,
                ...itemData.details,
                owner: itemData.owner,
              });
            }
          } catch (err) {
            console.error(`Error fetching token ${i}:`, err);
          }
        }

        setItems(userItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserItems();
  }, [address, totalSupply]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Alert
            type="warning"
            message="Please connect your wallet to view your items."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Items</h1>
          <p className="text-gray-600">
            View and manage your authenticated luxury items
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-luxury-gold">
                {balance ? Number(balance) : 0}
              </p>
              <p className="text-gray-600">Total Items</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-luxury-gold">
                {items.length}
              </p>
              <p className="text-gray-600">Loaded Items</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-luxury-gold">100%</p>
              <p className="text-gray-600">Authenticated</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Loading your items..." />
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No Items Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have any authenticated luxury items yet.
            </p>
          </div>
        )}

        {/* Items Grid */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item.tokenId}
                tokenId={item.tokenId}
                brand={item.brand}
                model={item.model}
                serialNumber={item.serialNumber}
                chipId={item.chipId}
                verificationDate={item.verificationDate}
                owner={item.owner}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;

