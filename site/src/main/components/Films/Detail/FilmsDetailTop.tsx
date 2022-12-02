import { MovieType } from '@const/types';

type Props = {
  movie?: MovieType;
};

export default function FilmsDetailTop(props: Props) {
  const { movie } = props;

  return (
    <div className="pm-main-film-info-top">
      <div className="pm-main-film-info-top-content">
        <h2 className="pm-main-film-info-title">{movie?.movie_title}</h2>
        <h3 className="pm-main-film-info-subtitle">
          {movie?.meta?.movie_original || movie?.movie_title}{' '}
          {movie?.meta?.movie_publish && `(${movie?.meta?.movie_publish})`}
        </h3>
      </div>
    </div>
  );
}
