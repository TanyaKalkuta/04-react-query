import axios from 'axios';
import type { Movie } from '../types/movie';

interface MoviesHttpResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const BASE_URL = `https://api.themoviedb.org/3`;

export default async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesHttpResponse> {
  try {
    const response = await axios.get<MoviesHttpResponse>(
      `${BASE_URL}/search/movie`,
      {
        params: { query, page },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error; // 👈 важливо для React Query
  }
}
