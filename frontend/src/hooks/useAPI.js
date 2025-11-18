import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/contract';

/**
 * Hook to fetch data from API
 */
export const useAPI = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (endpoint) {
      fetchData();
    } else {
      // Reset state when endpoint is null/empty
      setLoading(false);
      setData(null);
      setError(null);
    }
  }, [endpoint, ...dependencies]);

  return { data, loading, error };
};

/**
 * Hook to verify item via API
 */
export const useVerifyItemAPI = (chipId) => {
  return useAPI(chipId ? `/api/items/verify/${chipId}` : null, [chipId]);
};

/**
 * Hook to get item details via API
 */
export const useItemDetailsAPI = (tokenId) => {
  return useAPI(tokenId ? `/api/items/${tokenId}` : null, [tokenId]);
};

/**
 * Hook to get transfer history via API
 */
export const useTransferHistoryAPI = (tokenId) => {
  return useAPI(tokenId ? `/api/items/${tokenId}/history` : null, [tokenId]);
};

/**
 * Hook to get contract info via API
 */
export const useContractInfo = () => {
  return useAPI('/api/contract/info');
};

/**
 * Function to mint item via API
 */
export const mintItem = async (itemData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/items/mint`, itemData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};

/**
 * Function to transfer item via API
 */
export const transferItem = async (transferData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/items/transfer`, transferData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};

/**
 * Function to authorize verifier via API
 */
export const authorizeVerifier = async (verifierAddress, status) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/verifiers/authorize`, {
      verifierAddress,
      status,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};

