import Movie from './Movie'
import '../styles/movies.scss'

const Movies = ({ movies, viewTrailer, closeCard }) => {

    return (
        <div data-testid="movies" className='custom-grid'>
            {movies.movies.map((movie, i) => {
                return (
                    <Movie
                        movie={movie}
                        key={movie.id + `${i}`}
                        viewTrailer={viewTrailer}
                        closeCard={closeCard}
                    />
                )
            })}
        </div>
    )
}

export default Movies
