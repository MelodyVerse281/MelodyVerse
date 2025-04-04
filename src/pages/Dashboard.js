import React, { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import useSolanaWallet from '../hooks/useSolanaWallet';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { connected, publicKey, balance, userNFTs, isLoading, fetchUserNFTs, formatWalletAddress } = useSolanaWallet();
  const { connection } = useConnection();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    if (!connected || isRefreshing) return;
    
    setIsRefreshing(true);
    await fetchUserNFTs();
    setIsRefreshing(false);
  };
  
  useEffect(() => {
    if (connected && publicKey) {
      fetchUserNFTs();
    }
  }, [connected, publicKey, fetchUserNFTs]);
  
  if (!connected) {
    return (
      <div className="dashboard-container not-connected">
        <div className="connect-prompt">
          <h2>Please Connect Wallet</h2>
          <p>Please connect your Solana wallet to view your NFT collection and account information.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>User Dashboard</h2>
        <div className="wallet-info">
          <div className="wallet-address">
            <span className="label">Wallet Address:</span>
            <span className="value">{formatWalletAddress(publicKey)}</span>
          </div>
          <div className="wallet-balance">
            <span className="label">Balance:</span>
            <span className="value">{balance.toFixed(4)} SOL</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="nft-gallery-section">
          <div className="section-header">
            <h3>My NFT Collection</h3>
            <button 
              className="refresh-button" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {isLoading ? (
            <div className="loading-state">Loading...</div>
          ) : userNFTs.length > 0 ? (
            <div className="nft-grid">
              {userNFTs.map((nft, index) => (
                <div key={index} className="nft-card">
                  <div className="nft-preview" style={{ background: getRandomGradient() }}>
                    <span className="nft-symbol">♫</span>
                  </div>
                  <div className="nft-info">
                    <h4 className="nft-name">{nft.name}</h4>
                    <div className="nft-details">
                      <span className="nft-emotion">{nft.emotion}</span>
                      <span className="nft-mint">{formatWalletAddress(nft.mint)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You don't have any music NFTs yet</p>
              <button className="create-button" onClick={() => window.location.href = '/'}>
                Create Your First Music NFT
              </button>
            </div>
          )}
        </div>
        
        <div className="activity-section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {userNFTs.length > 0 ? (
              userNFTs.map((nft, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">🎵</div>
                  <div className="activity-details">
                    <span className="activity-title">Minted NFT: {nft.name}</span>
                    <span className="activity-time">{formatDate(new Date(nft.createdAt))}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-activity">No activity records</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function: random gradient background
const getRandomGradient = () => {
  const gradients = [
    'linear-gradient(135deg, #9e69fd, #64c2ff)',
    'linear-gradient(135deg, #FFC107, #FF9800)',
    'linear-gradient(135deg, #42A5F5, #1976D2)',
    'linear-gradient(135deg, #F44336, #E91E63)',
    'linear-gradient(135deg, #26A69A, #00796B)',
    'linear-gradient(135deg, #EC407A, #D81B60)',
    'linear-gradient(135deg, #5E35B1, #3949AB)',
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
};

// Helper function: format date
const formatDate = (date) => {
  const now = new Date();
  const diff = now - date;
  
  // Show how long ago for less than a day
  if (diff < 86400000) {
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    return `${Math.floor(diff / 3600000)} hours ago`;
  }
  
  // Show specific date for more than a day
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default Dashboard; 