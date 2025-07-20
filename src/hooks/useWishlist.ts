// src/hooks/useWishlist.ts
import { useState, useEffect } from 'react';
import { addToWishlist, removeFromWishlist, getWishlist, isInWishlist } from '../services/movieApi';

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Načíst wishlist při inicializaci
  useEffect(() => {
    setWishlist(getWishlist());
  }, []);

  const addMovie = async (movieId: number) => {
    try {
      setLoading(true);
      await addToWishlist(movieId);
      setWishlist(prev => [...prev, movieId]);
      return { success: true, message: 'Film byl přidán do seznamu přání' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Nepodařilo se přidat film' 
      };
    } finally {
      setLoading(false);
    }
  };

  const removeMovie = async (movieId: number) => {
    try {
      setLoading(true);
      await removeFromWishlist(movieId);
      setWishlist(prev => prev.filter(id => id !== movieId));
      return { success: true, message: 'Film byl odebrán ze seznamu přání' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Nepodařilo se odebrat film' 
      };
    } finally {
      setLoading(false);
    }
  };

  const toggleMovie = async (movieId: number) => {
    if (isInWishlist(movieId)) {
      return await removeMovie(movieId);
    } else {
      return await addMovie(movieId);
    }
  };

  const isMovieInWishlist = (movieId: number) => {
    return wishlist.includes(movieId);
  };

  return {
    wishlist,
    loading,
    addMovie,
    removeMovie,
    toggleMovie,
    isMovieInWishlist,
    wishlistCount: wishlist.length
  };
};
