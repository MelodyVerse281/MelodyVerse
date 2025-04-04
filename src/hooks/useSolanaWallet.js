import { useEffect, useState, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getUserNFTs } from '../services/nftService';

/**
 * Solana Wallet Interaction Hook
 * @returns {Object} Wallet state and interaction functions
 */
const useSolanaWallet = () => {
  const { connection } = useConnection();
  const { publicKey, connected, connecting, disconnect } = useWallet();
  
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userNFTs, setUserNFTs] = useState([]);
  
  /**
   * Get wallet balance
   */
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !connection) return;
    
    try {
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }, [publicKey, connection]);
  
  /**
   * Get user-owned NFTs
   */
  const fetchUserNFTs = useCallback(async () => {
    if (!publicKey || !connection) return;
    
    setIsLoading(true);
    try {
      const nfts = await getUserNFTs(connection, publicKey);
      setUserNFTs(nfts);
    } catch (error) {
      console.error('Failed to fetch NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection]);
  
  /**
   * Format wallet address
   * @param {PublicKey} address - Wallet address
   * @returns {string} Formatted address
   */
  const formatWalletAddress = useCallback((address) => {
    if (!address) return '';
    const addressStr = address.toString();
    return `${addressStr.slice(0, 4)}...${addressStr.slice(-4)}`;
  }, []);
  
  // Update balance when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      fetchUserNFTs();
    } else {
      setBalance(0);
      setUserNFTs([]);
    }
  }, [connected, publicKey, fetchBalance, fetchUserNFTs]);
  
  return {
    connected,
    connecting,
    publicKey,
    balance,
    userNFTs,
    isLoading,
    disconnect,
    formatWalletAddress,
    fetchBalance,
    fetchUserNFTs,
  };
};

export default useSolanaWallet; 