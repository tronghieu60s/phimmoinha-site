import { gql } from '@apollo/client';
import { Pagination, ResponseType } from '@const/types';
import { apolloMutation, apolloQuery } from '@core/apollo';
import {
  CreateMovieType,
  GetListMoviesParams,
  GetMovieParams,
  MovieType,
  UpdateMovieType,
} from './movie.types';

export const CORE_POST_FIELDS = gql`
  fragment CoreMovieFields on Movie {
    Id
    User {
      Id
      UserName
    }
    Type
    Title
    Content
    Slug
    Status
    Views
    Comment
    Password
    Avatar
    Original
    Duration
    Quality
    Quantity
    Trailer
    Publish
    DatePublish
    DateModified
    Episodes {
      Id
      Title
      Slug
      Order
      Source
      Date
    }
    EpisodesCount
    Taxonomies {
      Id
      Type
      Name
    }
  }
`;

export const getMovie = async (args: GetMovieParams) => {
  const { id, filter, isFilterId = false } = args;

  return apolloQuery<{ movie: ResponseType<MovieType> }>(
    gql`
      ${CORE_POST_FIELDS}
      query ($id: Float, $filter: MovieFilter, $isFilterId: Boolean) {
        movie(id: $id, filter: $filter, isFilterId: $isFilterId) {
          Data {
            ...CoreMovieFields
          }
        }
      }
    `,
    { id, filter, isFilterId },
  );
};

export const getMovies = async (args: GetListMoviesParams) => {
  const { sort, filter, pagination } = args;

  return apolloQuery<{ movies: ResponseType<Pagination<MovieType>> }>(
    gql`
      ${CORE_POST_FIELDS}
      query ($sort: MovieSort, $filter: MovieFilter, $pagination: PaginationInput) {
        movies(sort: $sort, filter: $filter, pagination: $pagination) {
          Data {
            Items {
              ...CoreMovieFields
            }
            Pagination {
              Page
              PageSize
              Total
              PageTotal
            }
          }
        }
      }
    `,
    { sort, filter, pagination },
  );
};

export const createMovie = async (input: CreateMovieType) =>
  apolloMutation<{ createMovie: ResponseType<MovieType> }>(
    gql`
      mutation ($input: CreateMovieInput!) {
        createMovie(input: $input) {
          InsertId
        }
      }
    `,
    { input },
  );

export const updateMovie = async (id: number, input: UpdateMovieType) =>
  apolloMutation<{ updateMovie: ResponseType<MovieType> }>(
    gql`
      mutation ($id: Float!, $input: UpdateMovieInput!) {
        updateMovie(id: $id, input: $input) {
          RowsAffected
        }
      }
    `,
    { id, input },
  );

export const deleteManyMovies = async (ids: number[]) =>
  apolloMutation<{ deleteManyMovies: ResponseType<boolean> }>(
    gql`
      mutation ($ids: [Float!]!) {
        deleteManyMovies(ids: $ids) {
          RowsAffected
        }
      }
    `,
    { ids },
  );

export const deleteTrashMovies = async () =>
  apolloMutation<{ deleteTrashMovies: ResponseType<boolean> }>(
    gql`
      mutation {
        deleteTrashMovies {
          RowsAffected
        }
      }
    `,
    {},
  );

export const restoreManyMovies = async (ids: string[]) =>
  apolloMutation<{ restoreManyMovies: ResponseType<boolean> }>(
    gql`
      mutation ($ids: [Float!]!) {
        restoreManyMovies(ids: $ids) {
          RowsAffected
        }
      }
    `,
    { ids },
  );
