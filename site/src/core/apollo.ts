import {
  ApolloClient,
  ApolloError,
  createHttpLink,
  DefaultOptions,
  DocumentNode,
  InMemoryCache,
} from '@apollo/client';

const APP_API_GRAPHQL_URL = process.env.NEXT_PUBLIC_APP_API_GRAPHQL_URL;

const defaultOptions: DefaultOptions = {
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
};

const apolloClient = new ApolloClient({
  link: createHttpLink({ uri: APP_API_GRAPHQL_URL }),
  cache: new InMemoryCache(),
  defaultOptions,
});

export const apolloQuery = async <T>(query: DocumentNode, variables?: any): Promise<T> =>
  new Promise((resolve, reject) => {
    apolloClient
      .query({ query, variables })
      .then((o) => resolve(o?.data))
      .catch((err: ApolloError) => reject(err));
  });

export const apolloMutation = async <T>(mutation: DocumentNode, variables?: any): Promise<T> =>
  new Promise((resolve, reject) => {
    apolloClient
      .mutate({ mutation, variables })
      .then((o) => resolve(o?.data))
      .catch((err: ApolloError) => reject(err));
  });

export default apolloClient;
