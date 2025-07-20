// src/hooks/useMovies.ts
import { useState, useEffect } from 'react';
import type { Movie, MovieDetails } from '../services/movieApi';
import { movieApi } from '../services/movieApi';

export const useMovies = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [heroMovie, setHeroMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Načíst různé kategorie filmů paralelně
        const [popularResponse, topRatedResponse, trendingResponse] = await Promise.all([
          movieApi.getPopularMovies(),
          movieApi.getTopRatedMovies(),
          movieApi.getTrendingMovies(),
        ]);

        setPopularMovies(popularResponse.results);
        setTopRatedMovies(topRatedResponse.results);
        setTrendingMovies(trendingResponse.results);

        // Použít první trending film jako hero banner
        if (trendingResponse.results.length > 0) {
          const heroMovieDetails = await movieApi.getMovieDetails(trendingResponse.results[0].id);
          setHeroMovie(heroMovieDetails);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nastala chyba při načítání dat');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return {
    popularMovies,
    topRatedMovies,
    trendingMovies,
    heroMovie,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
    }
  };
};
