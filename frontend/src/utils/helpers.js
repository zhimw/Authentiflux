/**
 * Truncate Ethereum address for display
 * @param {string} address - Full Ethereum address
 * @param {number} chars - Number of characters to show on each side
 * @returns {string} Truncated address
 */
export const truncateAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format ETH value with proper decimals
 * @param {string|number} value - Value in ETH
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted value
 */
export const formatEth = (value, decimals = 4) => {
  if (!value || value === '0' || value === '0.0') return '0';
  const num = parseFloat(value);
  return num.toFixed(decimals).replace(/\.?0+$/, '');
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Get block explorer URL for address
 * @param {string} address - Ethereum address
 * @param {number} chainId - Chain ID
 * @returns {string} Block explorer URL
 */
export const getExplorerUrl = (address, chainId) => {
  if (chainId === 1337) {
    return null; // No explorer for localhost
  }
  if (chainId === 80002) {
    return `https://amoy.polygonscan.com/address/${address}`;
  }
  return null;
};

/**
 * Get transaction explorer URL
 * @param {string} txHash - Transaction hash
 * @param {number} chainId - Chain ID
 * @returns {string} Block explorer URL
 */
export const getTxExplorerUrl = (txHash, chainId) => {
  if (chainId === 1337) {
    return null; // No explorer for localhost
  }
  if (chainId === 80002) {
    return `https://amoy.polygonscan.com/tx/${txHash}`;
  }
  return null;
};

