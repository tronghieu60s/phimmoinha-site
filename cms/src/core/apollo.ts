import {
  ApolloClient,
  ApolloError,
  createHttpLink,
  DefaultOptions,
  DocumentNode,
  FetchResult,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { t, exists } from 'i18next';
import { isEmptyObject } from './commonFuncs';
import { notificationError } from './notification';
import { getAuth } from './storage';

const APP_API_GRAPHQL_URL = process.env.APP_API_GRAPHQL_URL || 'http://localhost:4000/graphql';

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

const authLink = setContext((_, { headers }) => {
  const auth = getAuth();

  if (!auth || !auth.AccessToken || isEmptyObject(auth)) {
    return {};
  }

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${auth.AccessToken}`,
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(createHttpLink({ uri: APP_API_GRAPHQL_URL })),
  cache: new InMemoryCache(),
  defaultOptions,
});

const getMessage = (message: string) =>
  exists(`errors:${message}`) ? t(`errors:${message}`) : t('errors:Unknown');

const getResult = (result: FetchResult) => {
  const errorMessage = result.errors?.[0]?.message;
  const isUnauthorize = errorMessage === 'Unauthorized';

  if (isUnauthorize) {
    notificationError('Unauthorized', 'bottom', { message: '' });
  }

  if (errorMessage) {
    if (process.env.NODE_ENV === 'production') {
      notificationError(getMessage(errorMessage), 'bottom', { message: '' });
    }
    notificationError(errorMessage, 'bottom', { message: '' });
  }

  return result.data as any;
};

const getMessageError = (error: ApolloError) => {
  const isError = error.message.indexOf('ERROR_') === 0;
  const isValidate = error.message.indexOf('VALIDATE_') === 0;

  const errorMessage = (error.networkError as any)?.result?.errors?.[0]?.message;
  const isUnauthorize = errorMessage === 'Unauthorized';

  if (isError) {
    return notificationError(getMessage(error.message));
  }

  if (isValidate) {
    notificationError(getMessage('Validate'));
    return error.message;
  }

  if (isUnauthorize) {
    return notificationError('Unauthorized', 'bottom', { message: '' });
  }

  if (errorMessage) {
    if (process.env.NODE_ENV === 'production') {
      return notificationError(getMessage(error.message), 'bottom', { message: '' });
    }
    return notificationError(errorMessage, 'bottom', { message: '' });
  }

  return notificationError(getMessage(error.message), 'bottom', { message: '' });
};

export const apolloQuery = async <T>(query: DocumentNode, variables?: any): Promise<T> =>
  new Promise((resolve, reject) => {
    apolloClient
      .query({ query, variables })
      .then((o) => resolve(getResult(o)))
      .catch((err) => {
        const error = getMessageError(err);
        if (error) reject(error);
        resolve({} as T);
      });
  });

export const apolloMutation = async <T>(mutation: DocumentNode, variables?: any): Promise<T> =>
  new Promise((resolve, reject) => {
    apolloClient
      .mutate({ mutation, variables })
      .then((o) => resolve(getResult(o)))
      .catch((err) => {
        const error = getMessageError(err);
        if (error) reject(error);
        resolve({} as T);
      });
  });

export default apolloClient;
