import React from 'react';
import '../styles/Header.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function Header() {
  const { publicKey } = useWallet();
  
  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.toString().slice(0, 4)}...${address.toString().slice(-4)}`;
  };

  return (
    <header className="app-header">
      <div className="logo-container">
        <img src="/logo.svg" alt="MelodyVerse Logo" className="logo" />
        <h1>MelodyVerse</h1>
      </div>
      <nav className="nav-links">
        <div className="wallet-container">
          <WalletMultiButton className="wallet-btn" />
          {publicKey && (
            <span className="wallet-address">{formatWalletAddress(publicKey)}</span>
          )}
        </div>
        <button className="nav-btn">My Works</button>
        <button className="nav-btn">Explore</button>
      </nav>
    </header>
  );
}

export default Header; 