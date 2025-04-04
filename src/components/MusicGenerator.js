import React, { useState } from 'react';
import * as Tone from 'tone';
import '../styles/MusicGenerator.css';
import { recordAudio } from '../services/audioService';
import NFTMinter from './NFTMinter';
import { useWallet } from '@solana/wallet-adapter-react';

// Mock emotion analysis results
const analyzeEmotion = (text) => {
  const emotions = ['happy', 'sad', 'energetic', 'calm', 'romantic', 'mysterious'];
  const randomIndex = Math.floor(Math.random() * emotions.length);
  const intensity = Math.random() * 0.5 + 0.5; // 0.5 ~ 1.0
  
  return {
    primaryEmotion: emotions[randomIndex],
    intensity: intensity,
    tempo: intensity > 0.7 ? 'fast' : 'slow',
    complexity: Math.random() > 0.5 ? 'high' : 'low'
  };
};

// Simple music generation function
const generateMusic = async (emotionData) => {
  await Tone.start();
  const synth = new Tone.PolySynth().toDestination();
  const notes = [];
  
  // Choose notes based on emotion
  if (emotionData.primaryEmotion === 'happy' || emotionData.primaryEmotion === 'energetic') {
    notes.push('C4', 'E4', 'G4', 'B4', 'C5', 'G4', 'E4');
  } else if (emotionData.primaryEmotion === 'sad') {
    notes.push('C4', 'Eb4', 'G4', 'Bb4', 'C5', 'Bb4', 'G4');
  } else if (emotionData.primaryEmotion === 'romantic') {
    notes.push('C4', 'E4', 'A4', 'B4', 'C5', 'B4', 'A4');
  } else {
    notes.push('D4', 'F4', 'A4', 'C5', 'D5', 'A4', 'F4');
  }
  
  // Set tempo
  const tempo = emotionData.tempo === 'fast' ? '8n' : '4n';
  
  // Play sequence
  let time = 0;
  notes.forEach((note, index) => {
    synth.triggerAttackRelease(note, tempo, Tone.now() + time);
    time += emotionData.tempo === 'fast' ? 0.25 : 0.5;
  });
  
  return {
    duration: time,
    emotionData: emotionData
  };
};

function MusicGenerator() {
  const { connected } = useWallet();
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState(null);
  const [emotionResult, setEmotionResult] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showMinter, setShowMinter] = useState(false);
  const [mintHistory, setMintHistory] = useState([]);
  
  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setIsRecording(true);
    
    // Analyze emotion
    const emotionData = analyzeEmotion(inputText);
    setEmotionResult(emotionData);
    
    try {
      // Record audio
      const blob = await recordAudio(generateMusic, emotionData);
      setAudioBlob(blob);
      
      // Generate music (playable version)
      const musicData = await generateMusic(emotionData);
      setGeneratedMusic(musicData);
      
    } catch (error) {
      console.error('Failed to generate music:', error);
    } finally {
      setIsGenerating(false);
      setIsRecording(false);
    }
  };
  
  const handleMint = () => {
    if (!audioBlob) {
      alert('Please generate music first');
      return;
    }
    
    setShowMinter(true);
  };
  
  const handleMintSuccess = (result) => {
    // Record minting history
    setMintHistory([...mintHistory, {
      name: result.name,
      address: result.nftAddress.toString(),
      timestamp: new Date().toISOString()
    }]);
  };
  
  const handleCloseMinter = () => {
    setShowMinter(false);
  };
  
  // Show NFT minting interface
  if (showMinter) {
    return (
      <NFTMinter 
        audioBlob={audioBlob}
        musicInfo={emotionResult}
        onMintSuccess={handleMintSuccess}
        onCancel={handleCloseMinter}
      />
    );
  }
  
  return (
    <div className="music-generator">
      <h3>Create Your Music</h3>
      
      <textarea
        className="text-input"
        placeholder="Enter your emotions, poetry, or thoughts..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      
      <div className="controls">
        <button 
          className="generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating || !inputText.trim()}
        >
          {isGenerating ? (isRecording ? 'Recording...' : 'Generating...') : 'Generate Music'}
        </button>
        
        {generatedMusic && (
          <button 
            className="mint-btn"
            onClick={handleMint}
            disabled={!connected}
            title={!connected ? 'Please connect wallet first' : 'Mint as NFT'}
          >
            Mint as NFT
          </button>
        )}
      </div>
      
      {emotionResult && (
        <div className="emotion-display">
          <h4>Emotion Analysis Results</h4>
          <p>Primary Emotion: <span>{emotionResult.primaryEmotion}</span></p>
          <p>Intensity: <span>{Math.round(emotionResult.intensity * 100)}%</span></p>
          <p>Music Style: <span>{emotionResult.tempo} tempo, {emotionResult.complexity} complexity</span></p>
        </div>
      )}
      
      {mintHistory.length > 0 && (
        <div className="mint-history">
          <h4>My NFTs</h4>
          <ul className="history-list">
            {mintHistory.map((item, index) => (
              <li key={index} className="history-item">
                <span className="history-name">{item.name}</span>
                <span className="history-address">
                  {item.address.substring(0, 4)}...{item.address.substring(item.address.length - 4)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MusicGenerator; 