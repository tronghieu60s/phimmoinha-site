import { gql } from '@apollo/client';
import { MovieType, OptionType, Pagination, ResponseType } from '@const/types';
import { apolloQuery } from '@core/apollo';

export type CommonOptions = {
  siteConfig: ResponseType<OptionType>;
  headerConfig: ResponseType<OptionType>;
  footerConfig: ResponseType<OptionType>;
  keywordsConfig: ResponseType<OptionType>;
  newMoviesUpdate: ResponseType<Pagination<MovieType>>;
};

export const CORE_OPTIONS_FIELDS = gql`
  fragment CoreOptionsFields on Options {
    _id
    option_name
    option_value
  }
`;

export const getCommonOptions = () =>
  apolloQuery<CommonOptions>(
    gql`
      ${CORE_OPTIONS_FIELDS}
      query {
        siteConfig: getOption(key: "site") {
          data {
            ...CoreOptionsFields
          }
        }
        headerConfig: getOption(key: "ui.header") {
          data {
            ...CoreOptionsFields
          }
        }
        footerConfig: getOption(key: "ui.footer") {
          data {
            ...CoreOptionsFields
          }
        }
        keywordsConfig: getOption(key: "ui.keywords") {
          data {
            ...CoreOptionsFields
          }
        }
        newMoviesUpdate: getMovies(params: { orderby: movie_modified, pageSize: 30 }) {
          data {
            items {
              _id
              movie_title
              movie_slug
              movie_episodes
            }
          }
        }
      }
    `,
    {},
  );
