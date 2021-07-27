const Movie = require('../models/movie');
const ErrorManage = require('../middlewares/error-manage');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .populate('user')
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorManage('переданы некорректные данные в методы создания фильма').manageBadRequestError());
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new ErrorManage('фильм не найден').manageNotFoundError();
      }

      if (String(movie.owner) !== req.user._id) {
        throw new ErrorManage('нельзя удалять фильмы других пользователей').manageRightsError();
      }

      return movie;
    })
    .then((movie) => {
      Movie.findByIdAndRemove(movie._id)
        .then((data) => res.send(data));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorManage('некорректный id фильма').manageBadRequestError());
      }
      next(err);
    });
};
