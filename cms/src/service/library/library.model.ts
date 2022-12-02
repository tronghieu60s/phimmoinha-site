import { gql } from '@apollo/client';
import { Pagination, ResponseType } from '@const/types';
import { apolloMutation, apolloQuery } from '@core/apollo';
import {
  CreateLibraryType,
  GetLibraryParams,
  GetListLibrariesParams,
  LibraryType,
  UpdateLibraryType,
} from './library.types';

export const CORE_LIBRARY_FIELDS = gql`
  fragment CoreLibraryFields on Library {
    Id
    Type
    Key
    Value
    Color
  }
`;

export const getLibrary = async (args: GetLibraryParams) => {
  const { id, filter } = args;

  return apolloQuery<{ library: ResponseType<LibraryType> }>(
    gql`
      ${CORE_LIBRARY_FIELDS}
      query ($id: Float, $filter: LibraryFilter) {
        library(id: $id, filter: $filter) {
          Data {
            ...CoreLibraryFields
          }
        }
      }
    `,
    { id, filter },
  );
};

export const getLibraries = async (args: GetListLibrariesParams) => {
  const { sort, filter, pagination } = args;

  return apolloQuery<{ libraries: ResponseType<Pagination<LibraryType>> }>(
    gql`
      ${CORE_LIBRARY_FIELDS}
      query ($sort: LibrarySort, $filter: LibraryFilter, $pagination: PaginationInput) {
        libraries(sort: $sort, filter: $filter, pagination: $pagination) {
          Data {
            Items {
              ...CoreLibraryFields
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

export const createLibrary = async (input: CreateLibraryType) =>
  apolloMutation<{ createLibrary: ResponseType<LibraryType> }>(
    gql`
      mutation ($input: CreateLibraryInput!) {
        createLibrary(input: $input) {
          InsertId
        }
      }
    `,
    { input },
  );

export const updateLibrary = async (id: number, input: UpdateLibraryType) =>
  apolloMutation<{ updateLibrary: ResponseType<LibraryType> }>(
    gql`
      mutation ($id: Float!, $input: UpdateLibraryInput!) {
        updateLibrary(id: $id, input: $input) {
          RowsAffected
        }
      }
    `,
    { id, input },
  );

export const deleteLibrary = async (id: number) =>
  apolloMutation<{ deleteLibrary: ResponseType<boolean> }>(
    gql`
      mutation ($id: Float!) {
        deleteLibrary(id: $id) {
          RowsAffected
        }
      }
    `,
    { id },
  );
