import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import { toast, Toaster } from 'react-hot-toast';
import fetchMovies from '../../services/movieService';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import type { Movie } from '../../types/movie';

function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  // модалка
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim() !== '', // ❗ запит не робиться, поки немає query
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.results.length === 0 && query.trim() !== '') {
      toast.error('No movies found for your request.');
    }
  }, [data, query]);

  const handleSearch = (value: string) => {
    console.log('Searching for:', value);

    setQuery(value);
    setPage(1); // скидаємо на першу сторінку при новому пошуку
  };

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data?.results && (
        <MovieGrid movies={data.results} onSelect={openModal} />
      )}

      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      {/* ПАГІНАЦІЯ РЕНДЕРИТЬСЯ ТІЛЬКИ КОЛИ Є БІЛЬШЕ 1 СТОРІНКИ */}
      {data?.total_pages && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages ?? 0}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
