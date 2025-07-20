

import React, { useState, useEffect } from 'react';
import './MovieDetail.css';
import type { MovieDetails } from '../services/movieApi';
import { movieApi, getImageUrl, getBackdropUrl, formatDate, formatRating, getTrailerUrl } from '../services/movieApi';
import { useWishlist } from '../hooks/useWishlist';

interface MovieDetailProps {
  movieId: number;
  onClose: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  
  const { toggleMovie, isMovieInWishlist, loading: wishlistLoading } = useWishlist();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const movieData = await movieApi.getMovieDetails(movieId);
        setMovie(movieData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nastala chyba při načítání detailu filmu');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (loading) {
    return (
      <div className="movie-detail-overlay">
        <div className="movie-detail-container">
          <div className="movie-detail-loading">
            <div className="loading-spinner"></div>
            <p>Načítání detailu filmu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-overlay">
        <div className="movie-detail-container">
          <div className="movie-detail-error">
            <h2>Chyba při načítání</h2>
            <p>{error}</p>
            <button onClick={onClose} className="close-button">Zavřít</button>
          </div>
        </div>
      </div>
    );
  }

  const trailerUrl = getTrailerUrl(movie.videos);
  const backdropUrl = getBackdropUrl(movie.backdrop_path || '', 'original');
  const posterUrl = getImageUrl(movie.poster_path || '', 'w500');
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';

  return (
    <div className="movie-detail-overlay" onClick={onClose}>
      <div className="movie-detail-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✕</button>
        
        <div className="movie-detail-header">
          <div className="movie-detail-backdrop">
            <img src={backdropUrl} alt={movie.title} />
            <div className="backdrop-overlay"></div>
          </div>
          
          <div className="movie-detail-hero">
            <div className="movie-poster">
              <img src={posterUrl} alt={movie.title} />
            </div>
            
            <div className="movie-info">
              <h1 className="movie-title">{movie.title}</h1>
              
              <div className="movie-meta">
                <span className="release-year">{formatDate(movie.release_date)}</span>
                <span className="runtime">{runtime}</span>
                <span className="rating">⭐ {formatRating(movie.vote_average)}</span>
              </div>
              
              <div className="genres">
                {movie.genres?.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
              
              <p className="movie-overview">{movie.overview}</p>
              
              <div className="action-buttons">
                <button className="play-button">
                  ▶ Přehrát
                </button>
                {trailerUrl && (
                  <button 
                    className="trailer-button"
                    onClick={() => setShowTrailer(!showTrailer)}
                  >
                    🎬 {showTrailer ? 'Skrýt trailer' : 'Zobrazit trailer'}
                  </button>
                )}
                <button 
                  className="wishlist-button"
                  onClick={async () => {
                    if (movie) {
                      const result = await toggleMovie(movie.id);
                      if (!result.success) {
                        alert(result.message);
                      }
                    }
                  }}
                  disabled={wishlistLoading}
                >
                  {isMovieInWishlist(movieId) ? '❤️ V seznamu přání' : '♡ Přidat do seznamu'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {showTrailer && trailerUrl && (
          <div className="trailer-section">
            <h3>Trailer</h3>
            <div className="trailer-container">
              <iframe
                src={trailerUrl}
                title={`${movie.title} trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
        
        <div className="movie-details-section">
          <div className="details-grid">
            <div className="detail-item">
              <h4>Původní název</h4>
              <p>{movie.original_title || movie.title}</p>
            </div>
            
            <div className="detail-item">
              <h4>Datum vydání</h4>
              <p>{new Date(movie.release_date).toLocaleDateString('cs-CZ')}</p>
            </div>
            
            <div className="detail-item">
              <h4>Délka filmu</h4>
              <p>{runtime}</p>
            </div>
            
            <div className="detail-item">
              <h4>Hodnocení</h4>
              <p>{formatRating(movie.vote_average)}/10</p>
            </div>
            
            <div className="detail-item">
              <h4>Jazyk</h4>
              <p>{movie.original_language?.toUpperCase()}</p>
            </div>
            
            {movie.production_countries && movie.production_countries.length > 0 && (
              <div className="detail-item">
                <h4>Země původu</h4>
                <p>{movie.production_countries.map(country => country.name).join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail