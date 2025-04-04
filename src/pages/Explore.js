import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Explore.css';

const Explore = () => {
  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: 'all',
    emotion: 'all',
    sortBy: 'recent'
  });
  
  const navigate = useNavigate();

  // Mock data - in real app, this would come from an API
  const mockNfts = [
    {
      id: 'nft-001',
      title: 'Serenity in C Major',
      artist: 'CryptoMusician',
      thumbnail: 'https://via.placeholder.com/300',
      genre: 'classical',
      emotion: 'calm',
      price: 1.5,
      likes: 342,
      created: new Date('2025-05-10').getTime()
    },
    {
      id: 'nft-002',
      title: 'Digital Dreams',
      artist: 'ByteBeats',
      thumbnail: 'https://via.placeholder.com/300',
      genre: 'electronic',
      emotion: 'energetic',
      price: 0.8,
      likes: 129,
      created: new Date('2025-06-01').getTime()
    },
    {
      id: 'nft-003',
      title: 'Midnight Jazz',
      artist: 'CryptoSax',
      thumbnail: 'https://via.placeholder.com/300',
      genre: 'jazz',
      emotion: 'melancholy',
      price: 2.1,
      likes: 213,
      created: new Date('2025-05-25').getTime()
    },
    {
      id: 'nft-004',
      title: 'Quantum Beats',
      artist: 'WaveDAO',
      thumbnail: 'https://via.placeholder.com/300',
      genre: 'electronic',
      emotion: 'energetic',
      price: 1.2,
      likes: 178,
      created: new Date('2025-06-05').getTime()
    },
    {
      id: 'nft-005',
      title: 'Sunset Harmony',
      artist: 'MelodyMaker',
      thumbnail: 'https://via.placeholder.com/300',
      genre: 'ambient',
      emotion: 'peaceful',
      price: 0.9,
      likes: 95,
      created: new Date('2025-06-10').getTime()
    },
    {
      id: 'nft-006',
      title: 'Urban Rhythms',
      artist: 'BlockchainBeats',
      thumbnail: 'https://via.placeholder.com/300',
      genre: 'hiphop',
      emotion: 'confident',
      price: 1.8,
      likes: 276,
      created: new Date('2025-05-28').getTime()
    }
  ];

  useEffect(() => {
    // Simulating API fetch
    const fetchNfts = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an API call
        // const response = await fetch('/api/nfts');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setNfts(mockNfts);
          setFilteredNfts(mockNfts);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch NFTs. Please try again later.');
        setLoading(false);
      }
    };

    fetchNfts();
  }, []);

  useEffect(() => {
    let result = [...nfts];
    
    // Apply genre filter
    if (filters.genre !== 'all') {
      result = result.filter(nft => nft.genre === filters.genre);
    }
    
    // Apply emotion filter
    if (filters.emotion !== 'all') {
      result = result.filter(nft => nft.emotion === filters.emotion);
    }
    
    // Apply sorting
    if (filters.sortBy === 'recent') {
      result.sort((a, b) => b.created - a.created);
    } else if (filters.sortBy === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }
    
    setFilteredNfts(result);
  }, [filters, nfts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navigateToDetail = (id) => {
    navigate(`/nft/${id}`);
  };

  if (loading) return <div className="explore-loading">Loading NFT marketplace...</div>;
  if (error) return <div className="explore-error">{error}</div>;

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>Explore Music NFTs</h1>
        <p>Discover unique music created by artists from around the world</p>
      </div>

      <div className="explore-filters">
        <div className="filter-group">
          <label htmlFor="genre">Genre</label>
          <select 
            id="genre" 
            name="genre" 
            value={filters.genre} 
            onChange={handleFilterChange}
          >
            <option value="all">All Genres</option>
            <option value="classical">Classical</option>
            <option value="electronic">Electronic</option>
            <option value="jazz">Jazz</option>
            <option value="hiphop">Hip Hop</option>
            <option value="ambient">Ambient</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="emotion">Emotion</label>
          <select 
            id="emotion" 
            name="emotion" 
            value={filters.emotion} 
            onChange={handleFilterChange}
          >
            <option value="all">All Emotions</option>
            <option value="calm">Calm</option>
            <option value="energetic">Energetic</option>
            <option value="melancholy">Melancholy</option>
            <option value="peaceful">Peaceful</option>
            <option value="confident">Confident</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sortBy">Sort By</label>
          <select 
            id="sortBy" 
            name="sortBy" 
            value={filters.sortBy} 
            onChange={handleFilterChange}
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="nft-grid">
        {filteredNfts.length > 0 ? (
          filteredNfts.map(nft => (
            <div 
              key={nft.id} 
              className="nft-card" 
              onClick={() => navigateToDetail(nft.id)}
            >
              <div className="nft-thumbnail">
                <img src={nft.thumbnail} alt={nft.title} />
                <div className="play-overlay">
                  <i className="play-icon">▶</i>
                </div>
              </div>
              <div className="nft-info">
                <h3>{nft.title}</h3>
                <p className="nft-artist">by {nft.artist}</p>
                <div className="nft-meta">
                  <span className="nft-price">{nft.price} SOL</span>
                  <span className="nft-likes">❤ {nft.likes}</span>
                </div>
                <div className="nft-tags">
                  <span className="tag genre-tag">{nft.genre}</span>
                  <span className="tag emotion-tag">{nft.emotion}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No NFTs found matching your filters. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;