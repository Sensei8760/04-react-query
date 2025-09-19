import { useEffect, useMemo, useState } from 'react';
import styles from './App.module.css';
import SearchBar, { type SearchBarProps } from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import toast from 'react-hot-toast';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const enabled = useMemo(() => query.trim().length > 0, [query]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled,
    staleTime: 1000 * 60 * 3,
    retry: 1,
  });

  useEffect(() => {
    if (enabled && isError) toast.error('Something went wrong. Please try again.');
  }, [isError, enabled]);

  const totalPages = data?.total_pages ?? 0;
  const movies = data?.results ?? [];

  const handleSearch: SearchBarProps['onSubmit'] = (newQuery) => {
    const trimmed = newQuery.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setPage(1);
    setSelectedMovie(null);
  };

  return (
    <div className={styles.container}>
      <SearchBar onSubmit={handleSearch} />

      {(isLoading || isFetching) && <Loader />}
      {isError && <ErrorMessage />}

      {/* ⬆️ ПАГІНАЦІЯ ПЕРЕД ҐРІДОМ */}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={(m) => setSelectedMovie(m)} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
};

export default App;