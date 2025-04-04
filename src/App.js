import React from 'react';
import './styles/App.css';
import MusicGenerator from './components/MusicGenerator';
import Visualizer from './components/Visualizer';
import Header from './components/Header';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="app-content">
        <div className="app-description">
          <h2>Welcome to MelodyVerse</h2>
          <p>Enter your thoughts, emotions, or poetry, and AI will create music just for you.</p>
          <p>One sentence, define your melodic universe.</p>
        </div>
        <div className="creation-container">
          <MusicGenerator />
          <Visualizer />
        </div>
      </main>
      <footer className="app-footer">
        <p>© 2025 MelodyVerse - Music NFT platform based on AI and Solana blockchain</p>
      </footer>
    </div>
  );
}

export default App; 