import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-218f6-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();

      const loadedData = [];

      for(const key in  data){
        loadedData.push({id: key, title: data[key].title, openingText: data[key].openingText, releaseDate: data[key].releaseDate});
      }

   
      setMovies(loadedData);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
    // const timeInterval = setInterval(() => {
    //   fetchMoviesHandler();
    // }, 4000);

    // return () => {
    //   clearInterval(timeInterval);
    // }
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie, titleRef, openingTextRef, releaseDateRef) {
    try {

      const response = await fetch('https://react-http-218f6-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // const data = await response.json();
    if(response.ok){
      titleRef.current.value = "";
      openingTextRef.current.value = "";
      releaseDateRef.current.value = "";
      fetchMoviesHandler();
      return true;
    }else{
      throw new Error(response);
    }
      
    } catch (error) {
      console.log(error.status);
      return false;
    }
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

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
