import React from 'react';
import { Link } from 'react-router-dom';
import { truncateAddress, formatDate } from '../utils/helpers';

const ItemCard = ({ tokenId, brand, model, serialNumber, chipId, verificationDate, owner }) => {
  return (
    <Link to={`/item/${tokenId}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer border border-gray-200 hover:border-luxury-gold">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{brand}</h3>
            <p className="text-gray-600">{model}</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
            ✓ Verified
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Token ID:</span>
            <span className="font-mono text-gray-900">#{tokenId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Serial:</span>
            <span className="font-mono text-gray-900">{serialNumber}</span>
          </div>
          {owner && (
            <div className="flex justify-between">
              <span className="text-gray-500">Owner:</span>
              <span className="font-mono text-gray-900">{truncateAddress(owner)}</span>
            </div>
          )}
          {verificationDate && (
            <div className="flex justify-between">
              <span className="text-gray-500">Verified:</span>
              <span className="text-gray-900">{formatDate(verificationDate)}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-mono">{chipId}</span>
            <span className="text-luxury-gold hover:text-luxury-darkGold">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;

