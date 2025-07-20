// src/services/movieApi.ts
const API_KEY = 'fb089ca79714d179b6845d8a051d0303'; // Nahraďte svým API klíčem z TMDB
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Typy pro API response
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
  popularity: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  production_countries: { iso_3166_1: string; name: string }[];
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
      official: boolean;
    }>;
  };
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Pomocné funkce pro URL
export const getImageUrl = (path: string, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return 'https://placehold.co/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string, size: 'w780' | 'w1280' | 'original' = 'w1280') => {
  if (!path) return 'https://placehold.co/1280x720?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// API funkce
export const movieApi = {
  // Získat populární filmy
  getPopularMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=cs-CZ`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch popular movies');
    }
    return response.json();
  },

  // Získat top rated filmy
  getTopRatedMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}&language=cs-CZ`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch top rated movies');
    }
    return response.json();
  },

  // Získat nejnovější filmy
  getNowPlayingMovies: async (page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}&language=cs-CZ`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch now playing movies');
    }
    return response.json();
  },

  // Získat detail filmu včetně videí
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos&language=cs-CZ`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    return response.json();
  },

  // Vyhledat filmy
  searchMovies: async (query: string, page: number = 1): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=cs-CZ`
    );
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    return response.json();
  },

  // Získat trending filmy
  getTrendingMovies: async (timeWindow: 'day' | 'week' = 'week'): Promise<MoviesResponse> => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&language=cs-CZ`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch trending movies');
    }
    return response.json();
  },
};

// Přidat do wishlist (lokální implementace)
export const addToWishlist = async (movieId: number) => {
  try {
    // TMDB API nepodporuje wishlist přímo, takže použijeme localStorage
    const existingWishlist = getWishlist();
    
    if (existingWishlist.includes(movieId)) {
      throw new Error('Film už je v seznamu přání');
    }
    
    const updatedWishlist = [...existingWishlist, movieId];
    localStorage.setItem('movieWishlist', JSON.stringify(updatedWishlist));
    
    return { success: true, message: 'Film byl přidán do seznamu přání' };
  } catch (error) {
    throw new Error('Nepodařilo se přidat film do seznamu přání');
  }
};

// Odebrat z wishlist
export const removeFromWishlist = async (movieId: number) => {
  try {
    const existingWishlist = getWishlist();
    const updatedWishlist = existingWishlist.filter(id => id !== movieId);
    localStorage.setItem('movieWishlist', JSON.stringify(updatedWishlist));
    
    return { success: true, message: 'Film byl odebrán ze seznamu přání' };
  } catch (error) {
    throw new Error('Nepodařilo se odebrat film ze seznamu přání');
  }
};

// Získat wishlist
export const getWishlist = (): number[] => {
  try {
    const wishlist = localStorage.getItem('movieWishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    return [];
  }
};

// Zkontrolovat zda je film v wishlistu
export const isInWishlist = (movieId: number): boolean => {
  const wishlist = getWishlist();
  return wishlist.includes(movieId);
};



// Pomocné funkce
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

export const formatRating = (rating: number): number => {
  return Math.round(rating * 10) / 10;
};

export const getTrailerUrl = (videos?: MovieDetails['videos']): string | undefined => {
  if (!videos?.results?.length) return undefined;
  
  const trailer = videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );
  
  return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&loop=1&playlist=${trailer.key}` : undefined;
};
