import React, { useRef, useState } from 'react';
import './MovieSlider.css';
import MovieCard from './MovieCard';
import type { Movie } from '../services/movieApi';

interface MovieSliderProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movieId: number) => void;
}

const MovieSlider: React.FC<MovieSliderProps> = ({ title, movies, onMovieClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 400; // Kolik pixelů posunout
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  return (
    <div className="movie-slider-section">
      <h2 className="slider-title">{title}</h2>
      
      <div className="slider-container">
        {showLeftButton && (
          <button 
            className="slider-button slider-button-left"
            onClick={() => scroll('left')}
            aria-label="Posunout vlevo"
          >
            ‹
          </button>
        )}
        
        <div 
          className="movies-slider"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onClick={onMovieClick}
            />
          ))}
        </div>
        
        {showRightButton && (
          <button 
            className="slider-button slider-button-right"
            onClick={() => scroll('right')}
            aria-label="Posunout vpravo"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieSlider;
