import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

/**
 * Hook to read contract data
 */
export const useContractRead = (functionName, args = []) => {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName,
    args,
  });
};

/**
 * Hook to write to contract
 */
export const useContractWrite = () => {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  return {
    writeContract,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
};

/**
 * Hook to get total authenticated items
 */
export const useTotalItems = () => {
  return useContractRead('getTotalAuthenticatedItems');
};

/**
 * Hook to get item details by token ID
 */
export const useItemDetails = (tokenId) => {
  return useContractRead('getItemDetails', [tokenId]);
};

/**
 * Hook to get token owner
 */
export const useTokenOwner = (tokenId) => {
  return useContractRead('ownerOf', [tokenId]);
};

/**
 * Hook to verify item by chip ID
 */
export const useVerifyItem = (chipId) => {
  return useContractRead('verifyItemByChipId', [chipId]);
};

/**
 * Hook to get transfer history
 */
export const useTransferHistory = (tokenId) => {
  return useContractRead('getTransferHistory', [tokenId]);
};

/**
 * Hook to check if address is authorized verifier
 */
export const useIsVerifier = (address) => {
  return useContractRead('authorizedVerifiers', [address]);
};

/**
 * Hook to get NFT balance of an address
 */
export const useNFTBalance = (address) => {
  return useContractRead('balanceOf', [address]);
};

