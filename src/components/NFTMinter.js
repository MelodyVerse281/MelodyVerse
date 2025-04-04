import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import '../styles/NFTMinter.css';
import { mintMusicNFT } from '../services/nftService';
import { downloadAudio } from '../services/audioService';

function NFTMinter({ audioBlob, musicInfo, onMintSuccess, onCancel }) {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  
  const [nftName, setNftName] = useState(`Music Universe #${Math.floor(Math.random() * 1000)}`);
  const [nftDescription, setNftDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mintResult, setMintResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleMint = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!nftName.trim()) {
      setError('Please enter an NFT name');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const nftData = {
        audioBlob,
        name: nftName,
        description: nftDescription || `Unique music generated from the emotion "${musicInfo.primaryEmotion}"`,
        attributes: {
          emotion: musicInfo.primaryEmotion,
          intensity: `${Math.round(musicInfo.intensity * 100)}%`,
          tempo: musicInfo.tempo
        }
      };
      
      const result = await mintMusicNFT(connection, publicKey, nftData);
      
      if (result.success) {
        setMintResult(result);
        onMintSuccess && onMintSuccess(result);
      } else {
        setError(result.error || 'Minting failed, please try again later');
      }
      
    } catch (err) {
      console.error('Error during minting process:', err);
      setError('Error during minting process: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (audioBlob) {
      downloadAudio(audioBlob, `${nftName.replace(/\s+/g, '_')}.wav`);
    }
  };
  
  if (mintResult) {
    return (
      <div className="nft-minter">
        <div className="mint-success">
          <div className="success-icon">🎉</div>
          <h3>Minting Successful!</h3>
          <p>Your music NFT has been successfully minted</p>
          
          <div className="nft-details">
            <div className="detail-item">
              <span className="label">NFT Name:</span>
              <span className="value">{nftName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Transaction Signature:</span>
              <span className="value tx-hash">{mintResult.txSignature.substring(0, 8)}...</span>
            </div>
            <div className="detail-item">
              <span className="label">NFT Address:</span>
              <span className="value">{mintResult.nftAddress.toString().substring(0, 6)}...{mintResult.nftAddress.toString().substring(mintResult.nftAddress.toString().length - 4)}</span>
            </div>
          </div>
          
          <div className="success-actions">
            <button className="view-btn" onClick={() => window.open(`https://explorer.solana.com/address/${mintResult.nftAddress.toString()}?cluster=devnet`, '_blank')}>
              View NFT
            </button>
            <button className="secondary-btn" onClick={() => setMintResult(null)}>
              Mint Another
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="nft-minter">
      <h3>Mint Your Music NFT</h3>
      
      <div className="mint-form">
        <div className="form-group">
          <label>NFT Name</label>
          <input 
            type="text" 
            value={nftName} 
            onChange={(e) => setNftName(e.target.value)}
            placeholder="Name your music creation"
            maxLength={50}
          />
        </div>
        
        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea 
            value={nftDescription} 
            onChange={(e) => setNftDescription(e.target.value)}
            placeholder="Describe the inspiration for your music creation..."
            maxLength={200}
          />
        </div>
        
        <div className="nft-attributes">
          <h4>NFT Attributes</h4>
          <div className="attributes-list">
            <div className="attribute-item">
              <span className="attribute-name">Emotion:</span>
              <span className="attribute-value">{musicInfo.primaryEmotion}</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-name">Intensity:</span>
              <span className="attribute-value">{Math.round(musicInfo.intensity * 100)}%</span>
            </div>
            <div className="attribute-item">
              <span className="attribute-name">Tempo:</span>
              <span className="attribute-value">{musicInfo.tempo}</span>
            </div>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="mint-actions">
          <button 
            className="mint-nft-btn" 
            onClick={handleMint}
            disabled={isProcessing || !connected}
          >
            {isProcessing ? 'Minting...' : 'Mint NFT'}
          </button>
          
          <button 
            className="download-btn" 
            onClick={handleDownload}
          >
            Download Audio
          </button>
          
          <button 
            className="cancel-btn" 
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default NFTMinter; 