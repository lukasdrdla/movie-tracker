import React from 'react';
import './MovieCard.css';
import type { Movie } from '../services/movieApi';
import { getImageUrl, formatDate, formatRating } from '../services/movieApi';

interface MovieCardProps {
  movie: Movie;
  onClick?: (movieId: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(movie.id);
    }
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="poster-wrapper">
        <img 
          src={getImageUrl(movie.poster_path || '', 'w500')} 
          alt={movie.title} 
          className="poster"
        />
        <div className="movie-card-overlay">
          <div className="play-icon">▶</div>
        </div>
      </div>
      <div className="movie-content">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{formatDate(movie.release_date)}</p>
        <div className="movie-rating">⭐ {formatRating(movie.vote_average)}</div>
      </div>
    </div>
  );
};

export default MovieCard;
