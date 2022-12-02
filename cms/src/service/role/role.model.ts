import { gql } from '@apollo/client';
import { Pagination, ResponseType } from '@const/types';
import { apolloMutation, apolloQuery } from '@core/apollo';
import {
  CreateRoleType,
  GetListRolesParams,
  GetRoleParams,
  RoleType,
  UpdateRoleType,
} from './role.types';

export const CORE_ROLE_FIELDS = gql`
  fragment CoreRoleFields on Role {
    Id
    Name
    Description
  }
`;

export const getRole = async (args: GetRoleParams) => {
  const { id, filter } = args;

  return apolloQuery<{ role: ResponseType<RoleType> }>(
    gql`
      ${CORE_ROLE_FIELDS}
      query ($id: Float, $filter: RoleFilter) {
        role(id: $id, filter: $filter) {
          Data {
            ...CoreRoleFields
            Permissions {
              Id
              Name
            }
          }
        }
      }
    `,
    { id, filter },
  );
};

export const getRoles = async (args: GetListRolesParams) => {
  const { sort, filter, pagination } = args;

  return apolloQuery<{ roles: ResponseType<Pagination<RoleType>> }>(
    gql`
      ${CORE_ROLE_FIELDS}
      query ($sort: RoleSort, $filter: RoleFilter, $pagination: PaginationInput) {
        roles(sort: $sort, filter: $filter, pagination: $pagination) {
          Data {
            Items {
              ...CoreRoleFields
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

export const createRole = async (input: CreateRoleType) =>
  apolloMutation<{ createRole: ResponseType<RoleType> }>(
    gql`
      mutation ($input: CreateRoleInput!) {
        createRole(input: $input) {
          InsertId
        }
      }
    `,
    { input },
  );

export const updateRole = async (id: number, input: UpdateRoleType) =>
  apolloMutation<{ updateRole: ResponseType<RoleType> }>(
    gql`
      mutation ($id: Float!, $input: UpdateRoleInput!) {
        updateRole(id: $id, input: $input) {
          RowsAffected
        }
      }
    `,
    { id, input },
  );

export const deleteRole = async (id: number) =>
  apolloMutation<{ deleteRole: ResponseType<boolean> }>(
    gql`
      mutation ($id: Float!) {
        deleteRole(id: $id) {
          RowsAffected
        }
      }
    `,
    { id },
  );
