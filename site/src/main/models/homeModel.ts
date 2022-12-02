import { gql } from '@apollo/client';
import { MovieType, Pagination, ResponseType } from '@const/types';
import { apolloQuery } from '@core/apollo';

export type HomeData = {
  filmsMovie: ResponseType<Pagination<MovieType>>;
  filmsSeries: ResponseType<Pagination<MovieType>>;
  filmsUpcoming: ResponseType<Pagination<MovieType>>;
};

export const getHomeData = async () =>
  apolloQuery<HomeData>(
    gql`
      query {
        filmsMovie: getMovies(params: { search: { movie_type: "movie" }, pageSize: 12 }) {
          data {
            items {
              _id
              meta
              movie_title
              movie_slug
            }
          }
        }
        filmsSeries: getMovies(params: { search: { movie_type: "series" }, pageSize: 12 }) {
          data {
            items {
              _id
              meta
              movie_title
              movie_slug
            }
          }
        }
        filmsUpcoming: getMovies(params: { search: { movie_episodes: [] }, pageSize: 10 }) {
          data {
            items {
              _id
              meta
              movie_title
              movie_slug
            }
          }
        }
      }
    `,
    {},
  );
