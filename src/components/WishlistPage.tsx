import React, { useState, useEffect } from 'react';
import './WishlistPage.css';
import MovieCard from './MovieCard';
import type { MovieDetails } from '../services/movieApi';
import { movieApi } from '../services/movieApi';
import { useWishlist } from '../hooks/useWishlist';

interface WishlistPageProps {
  onMovieClick: (movieId: number) => void;
  onClose: () => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ onMovieClick, onClose }) => {
  const { wishlist } = useWishlist();
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlistMovies = async () => {
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const moviePromises = wishlist.map(movieId => movieApi.getMovieDetails(movieId));
        const movieDetails = await Promise.all(moviePromises);
        
        setMovies(movieDetails);
      } catch (err) {
        setError('Nepodařilo se načíst filmy ze seznamu přání');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistMovies();
  }, [wishlist]);

  if (loading) {
    return (
      <div className="wishlist-overlay">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <h1>Seznam přání</h1>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>
          <div className="wishlist-loading">
            <div className="loading-spinner"></div>
            <p>Načítání seznamu přání...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-overlay">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <h1>Seznam přání</h1>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>
          <div className="wishlist-error">
            <h2>Chyba</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-overlay">
        <div className="wishlist-container">
          <div className="wishlist-header">
            <h1>Seznam přání</h1>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>
          <div className="wishlist-empty">
            <div className="empty-icon">❤️</div>
            <h2>Váš seznam přání je prázdný</h2>
            <p>Přidejte filmy do seznamu přání kliknutím na ♡ u filmu</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-overlay" onClick={onClose}>
      <div className="wishlist-container" onClick={(e) => e.stopPropagation()}>
        <div className="wishlist-header">
          <h1>Seznam přání ({wishlist.length})</h1>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="wishlist-content">
          <div className="wishlist-grid">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onClick={onMovieClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
