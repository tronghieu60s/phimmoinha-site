import { gql } from '@apollo/client';
import { Pagination, ResponseType } from '@const/types';
import {
  CreateUserType,
  GetListUsersParams,
  GetUserParams,
  UpdateUserType,
  UserType,
} from '@service/user/user.types';
import { apolloMutation, apolloQuery } from '@core/apollo';

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    Id
    Role {
      Id
      Name
    }
    UserName
    Email
    IsAdministrator
    FirstName
    LastName
    FullName
    UserSections {
      Id
      OnlineStatus
    }
  }
`;

export const getUser = async (args: GetUserParams) => {
  const { id, filter } = args;

  return apolloQuery<{ user: ResponseType<UserType> }>(
    gql`
      ${CORE_USER_FIELDS}
      query ($id: Float, $filter: UserFilter) {
        user(id: $id, filter: $filter) {
          Data {
            ...CoreUserFields
          }
        }
      }
    `,
    { id, filter },
  );
};

export const getUsers = async (args: GetListUsersParams) => {
  const { sort, filter, pagination } = args;

  return apolloQuery<{ users: ResponseType<Pagination<UserType>> }>(
    gql`
      ${CORE_USER_FIELDS}
      query ($sort: UserSort, $filter: UserFilter, $pagination: PaginationInput) {
        users(sort: $sort, filter: $filter, pagination: $pagination) {
          Data {
            Items {
              ...CoreUserFields
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

export const createUser = async (input: CreateUserType) =>
  apolloMutation<{ createUser: ResponseType<UserType> }>(
    gql`
      mutation ($input: CreateUserInput!) {
        createUser(input: $input) {
          InsertId
        }
      }
    `,
    { input },
  );

export const updateUser = async (id: number, input: UpdateUserType) =>
  apolloMutation<{ updateUser: ResponseType<UserType> }>(
    gql`
      mutation ($id: Float!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) {
          RowsAffected
        }
      }
    `,
    { id, input },
  );

export const deleteManyUsers = async (ids: number[]) =>
  apolloMutation<{ deleteManyUsers: ResponseType<boolean> }>(
    gql`
      mutation ($ids: [Float!]!) {
        deleteManyUsers(ids: $ids) {
          RowsAffected
        }
      }
    `,
    { ids },
  );
