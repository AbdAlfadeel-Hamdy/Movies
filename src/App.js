import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://react-http-a0e9b-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) throw new Error(`Something went wrong!`);
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        console.log(key);
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      // const transformedMovies = data.results.map((movie) => {
      //   return {
      //     title: movie.title,
      //     id: movie.episode_id,
      //     releaseDate: movie.release_date,
      //     openingText: movie.opening_crawl,
      //   };
      // });
      setMovies(loadedMovies);
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  const addMovieHandler = async (movie) => {
    await fetch(
      `https://react-http-a0e9b-default-rtdb.firebaseio.com/movies.json`,
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    fetchMoviesHandler();
  };

  let content = <p>No movies found!</p>;
  if (movies.length > 0) content = <MoviesList movies={movies} />;
  if (error) content = <p>{error}</p>;
  if (isLoading) content = <p>Loading...</p>;

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
