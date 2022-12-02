import { GENRE_LIST, MOVIE_INFO } from '@const/path';
import { BreadcrumbType, MovieType } from '@const/types';
import FilmWatchContainer from '@containers/FilmWatchContainer';
import { getCommonData } from '@core/next';
import { getMovie, getMovies } from '@models/moviesModel';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useMemo } from 'react';

type Props = {
  movie: MovieType;
  episode: string;
};

const APP_PAGE_REVALIDATE_TIME = process.env.NEXT_PUBLIC_APP_PAGE_REVALIDATE_TIME || 1000;

export default function WatchSlugEpisode(props: Props) {
  const { movie, episode } = props;

  const genres = useMemo(
    () => movie.terms?.filter((term) => term.term_taxonomy === 'movie_category') || [],
    [movie],
  );

  const breadcrumb = useMemo(
    (): BreadcrumbType[] => [
      ...genres.map((genre) => ({
        label: `${genre.term_name}`,
        path: `/${GENRE_LIST}/${genre.term_slug}`,
      })),
      {
        label: `${movie.movie_title}`,
        path: `/${MOVIE_INFO}/${movie.movie_title}`,
      },
    ],
    [genres, movie.movie_title],
  );

  return <FilmWatchContainer movie={movie} episode={episode} breadcrumb={breadcrumb} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const moviesItem = await getMovies({});
  const movies = moviesItem?.getMovies?.data?.items;

  const paths =
    movies?.map((movie) => ({
      params: { ep: 'tap-1', slug: movie.movie_slug },
    })) || [];

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params = {} } = context;
  const { ep, slug } = params;

  const movieItem = await getMovie({ params: { movie_slug: String(slug) } });
  const movie = movieItem?.getMovie?.data;

  if (!movie) {
    return { notFound: true };
  }

  const movieEpisode = movie?.movie_episodes?.find((episode) => episode.episode_slug === ep);
  if (!movieEpisode) {
    return { notFound: true };
  }

  const { episode_name } = movieEpisode;

  return {
    props: {
      ...(await getCommonData(context, {
        type: 'article',
        title: `${movie?.movie_title} - ${episode_name}`,
        description: movie?.movie_excerpt,
        image: movie?.meta?.movie_avatar,
        sidebar: true,
      })),
      movie,
      episode: ep,
    },
    revalidate: Number(APP_PAGE_REVALIDATE_TIME),
  };
};
