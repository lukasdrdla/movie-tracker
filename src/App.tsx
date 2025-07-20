import './App.css'
import NetflixNavigation from './components/NetflixNavigation'
import HeroBanner from './components/HeroBanner'
import MovieDetail from './components/MovieDetail'
import MovieSlider from './components/MovieSlider'
import WishlistPage from './components/WishlistPage'
import { useMovies } from './hooks/useMovies'
import { useState } from 'react'

function App() {
  const { popularMovies, topRatedMovies, trendingMovies, heroMovie, loading, error } = useMovies();
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [showWishlist, setShowWishlist] = useState(false);

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseDetail = () => {
    setSelectedMovieId(null);
  };

  const handleWishlistClick = () => {
    setShowWishlist(true);
  };

  const handleCloseWishlist = () => {
    setShowWishlist(false);
  };

  if (loading) {
    return (
      <>
        <NetflixNavigation onWishlistClick={handleWishlistClick} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Načítání filmů...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NetflixNavigation onWishlistClick={handleWishlistClick} />
        <div className="error-container">
          <h2>Chyba při načítání dat</h2>
          <p>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NetflixNavigation onWishlistClick={handleWishlistClick} />
      
      {heroMovie && <HeroBanner movie={heroMovie} />}
      
      <MovieSlider
        title="Trendy tohoto týdne"
        movies={trendingMovies.slice(0, 12)}
        onMovieClick={handleMovieClick}
      />

      <MovieSlider
        title="Populární filmy"
        movies={popularMovies.slice(0, 12)}
        onMovieClick={handleMovieClick}
      />

      <MovieSlider
        title="Nejlépe hodnocené"
        movies={topRatedMovies.slice(0, 12)}
        onMovieClick={handleMovieClick}
      />

      {selectedMovieId && (
        <MovieDetail 
          movieId={selectedMovieId} 
          onClose={handleCloseDetail}
        />
      )}

      {showWishlist && (
        <WishlistPage 
          onMovieClick={handleMovieClick}
          onClose={handleCloseWishlist}
        />
      )}
    </>
  )
}

export default App
