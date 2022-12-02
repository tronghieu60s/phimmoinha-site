import { gql } from '@apollo/client';
import {
  GetDocParams,
  GetListMoviesParams,
  MovieType,
  Pagination,
  ReportParams,
  ResponseType,
} from '@const/types';
import { apolloMutation, apolloQuery } from '@core/apollo';

export const CORE_MOVIES_FIELDS = gql`
  fragment CoreMoviesFields on Movies {
    _id
    meta
    user {
      user_login
    }
    terms
    movie_parent
    movie_title
    movie_content
    movie_slug
    movie_excerpt
    movie_type
    movie_status
    movie_comment
    movie_episodes
    movie_date
    movie_modified
  }
`;

export const CORE_REPORT_MOVIES_FIELDS = gql`
  fragment CoreReportMoviesFields on ReportMovies {
    _id
    report_reason
  }
`;

export const getMovie = async (args: GetDocParams<MovieType>) => {
  const { id, params } = args;

  return apolloQuery<{
    getMovie: ResponseType<MovieType>;
  }>(
    gql`
      ${CORE_MOVIES_FIELDS}
      query ($id: ID, $params: JSON) {
        getMovie(id: $id, params: $params) {
          data {
            ...CoreMoviesFields
          }
        }
      }
    `,
    { id, params },
  );
};

export const getMovies = async (args: GetListMoviesParams) => {
  const { ids, params = {} } = args;
  const { search, page, pageSize, order, orderby, loadAll, loadMore } = params;

  return apolloQuery<{
    getMovies: ResponseType<Pagination<MovieType>>;
  }>(
    gql`
      ${CORE_MOVIES_FIELDS}
      query (
        $ids: [ID]
        $search: JSON
        $page: Int
        $pageSize: Int
        $order: FieldsOrderEnum
        $orderby: MoviesFieldsOrderEnum
        $loadAll: Boolean
        $loadMore: Boolean
      ) {
        getMovies(
          ids: $ids
          params: {
            search: $search
            page: $page
            pageSize: $pageSize
            order: $order
            orderby: $orderby
            loadAll: $loadAll
            loadMore: $loadMore
          }
        ) {
          data {
            items {
              ...CoreMoviesFields
            }
            pagination {
              total
              pageTotal
              page
              pageSize
            }
          }
        }
      }
    `,
    { ids, search, page, pageSize, order, orderby, loadAll, loadMore },
  );
};

export const getMoviePlayerFbo = async (args: { source_id: string; source_new?: boolean }) => {
  const { source_id, source_new = false } = args;

  return apolloQuery<{
    getMoviePlayerFbo: ResponseType<string>;
  }>(
    gql`
      query ($source_id: String!, $source_new: Boolean) {
        getMoviePlayerFbo(source_id: $source_id, source_new: $source_new) {
          data
        }
      }
    `,
    { source_id, source_new },
  );
};

export const reportMovie = async (args: ReportParams) => {
  const { id, report_reason } = args;

  return apolloMutation<{
    reportMovie: ResponseType<ReportParams>;
  }>(
    gql`
      ${CORE_REPORT_MOVIES_FIELDS}
      mutation ($id: ID!, $report_reason: String!) {
        reportMovie(id: $id, input: { report_reason: $report_reason }) {
          data {
            ...CoreReportMoviesFields
          }
        }
      }
    `,
    { id, report_reason },
  );
};
