import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  createSearchParams,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'reactjs-popup/dist/index.css';
import { fetchMovies } from './data/moviesSlice';
import {
  ENDPOINT_SEARCH,
  ENDPOINT_DISCOVER,
  ENDPOINT,
  API_KEY,
} from './constants';
import Header from './components/Header';
import Movies from './components/Movies';
import Starred from './components/Starred';
import WatchLater from './components/WatchLater';

import ModalVideo from './components/ModalVideo';
import './app.scss';

const App = () => {
  const state = useSelector((state) => state);
  const { movies } = state;
  const [searchParams, setSearchParams] = useSearchParams();
  const [videoKey, setVideoKey] = useState();
  const [isOpen, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const searchQuery = searchParams.get('search');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let loading = false;

  // This function is used to fetch movies from the API based on a
  // search query. If the query is empty, the function fetches all
  // movies from the API.
  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=` + query));
      setSearchParams(createSearchParams({ search: query }));
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER));
      setSearchParams();
    }
  };

  // This function is used to search for movies by query string
  // query: the search term
  const searchMovies = (query) => {
    navigate('/');
    getSearchResults(query);
  };

  // This function gets all movies from the database.
  // It uses the database object, which is a global variable.
  // This function is called by the server when the user navigates to /movies.
  // It returns an array of movie objects.
  const getMovies = () => {
    if (searchQuery) {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=` + searchQuery));
    } else {
      if (!loading) {
        loading = true;
        dispatch(fetchMovies(ENDPOINT_DISCOVER));
        setPage(page + 1);
        setTimeout(() => {
          loading = false;
        }, 500);
      }
    }
  };

  // Get more movies from the API
  // We are getting the next page of movies, so the page number is increased by 1
  // The page number is passed in as an argument
  const getMoreMovies = (page: number) => {
    dispatch(fetchMovies(`${ENDPOINT_DISCOVER}'&page=` + page));
  };

  // This function takes a movie object and returns a function that takes a function
  // as an argument. The function that is returned takes the function that was passed
  // in as an argument and executes it.
  const viewTrailer = (movie) => {
    getMovie(movie.id);
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    setOpen(true);
  };

  // This is a function that closes a modal
  // The modal is used to display a popup with some information
  // The function takes no parameters
  // It sets the open state to false
  const closeModal = () => {
    setOpen(false);
    document.getElementsByTagName('body')[0].style.overflow = 'auto';
  };

  // This function takes a movie ID and returns a promise containing the movie if it exists.
  // The movie is retrieved from the database.
  // If the movie does not exist, the promise will resolve to null.
  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`;

    setVideoKey(null);
    const videoData = await fetch(URL).then((response) => response.json());

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(
        (vid) => vid.type === 'Trailer'
      );
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key);
    }
  };

  // This function is called on scroll, and updates the
  // scroll position in the store.
  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight + 1 >= scrollHeight) {
      setPage(page + 1);
      getMoreMovies(page);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);

  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div className="App">
      <Header
        searchMovies={searchMovies}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      <div className="container">
        {isOpen && <ModalVideo videoKey={videoKey} closeModal={closeModal} />}

        <Routes>
          <Route
            path="/"
            element={
              <div className="movies-container">
                <Movies movies={movies} viewTrailer={viewTrailer} />
              </div>
            }
          />
          <Route
            path="/starred"
            element={<Starred viewTrailer={viewTrailer} />}
          />
          <Route
            path="/watch-later"
            element={<WatchLater viewTrailer={viewTrailer} />}
          />
          <Route
            path="*"
            element={<h1 className="not-found">Page Not Found</h1>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
