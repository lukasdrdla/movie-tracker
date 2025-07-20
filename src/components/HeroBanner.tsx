import React from 'react';
import './HeroBanner.css';
import type { MovieDetails } from '../services/movieApi';
import { getBackdropUrl, formatDate, formatRating, getTrailerUrl } from '../services/movieApi';

interface HeroBannerProps {
  movie: MovieDetails;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ movie }) => {
  const trailerUrl = getTrailerUrl(movie.videos);
  const backdropUrl = getBackdropUrl(movie.backdrop_path || '', 'original');
  const genres = movie.genres?.slice(0, 2).map(g => g.name).join(', ') || '';

  return (
    <div className="hero-banner">
      <div className="hero-background">
        {trailerUrl ? (
          <iframe
            className="hero-video"
            src={trailerUrl}
            title={`${movie.title} trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img 
            src={backdropUrl} 
            alt={movie.title}
            className="hero-image"
          />
        )}
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-info">
          <h1 className="hero-title">{movie.title}</h1>
          <div className="hero-meta">
            <span className="hero-year">{formatDate(movie.release_date)}</span>
            <span className="hero-rating">⭐ {formatRating(movie.vote_average)}</span>
            {genres && <span className="hero-genre">{genres}</span>}
          </div>
          <p className="hero-description">{movie.overview}</p>
          
          <div className="hero-buttons">
            <button className="hero-button hero-button-play">
              ▶ Přehrát
            </button>
            <button className="hero-button hero-button-info">
              ⓘ Více informací
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
