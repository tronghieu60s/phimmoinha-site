import { gql } from '@apollo/client';
import { Pagination, ResponseType } from '@const/types';
import { apolloMutation, apolloQuery } from '@core/apollo';
import {
  CreatePermissionType,
  GetListPermissionsParams,
  GetPermissionParams,
  PermissionType,
  UpdatePermissionType,
} from './permission.types';

export const CORE_PERMISSION_FIELDS = gql`
  fragment CorePermissionFields on Permission {
    Id
    Name
    Description
  }
`;

export const getPermission = async (args: GetPermissionParams) => {
  const { id, filter } = args;

  return apolloQuery<{ permission: ResponseType<PermissionType> }>(
    gql`
      ${CORE_PERMISSION_FIELDS}
      query ($id: Float, $filter: PermissionFilter) {
        permission(id: $id, filter: $filter) {
          Data {
            ...CorePermissionFields
          }
        }
      }
    `,
    { id, filter },
  );
};

export const getPermissions = async (args: GetListPermissionsParams) => {
  const { sort, filter, pagination } = args;

  return apolloQuery<{ permissions: ResponseType<Pagination<PermissionType>> }>(
    gql`
      ${CORE_PERMISSION_FIELDS}
      query ($sort: PermissionSort, $filter: PermissionFilter, $pagination: PaginationInput) {
        permissions(sort: $sort, filter: $filter, pagination: $pagination) {
          Data {
            Items {
              ...CorePermissionFields
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

export const createPermission = async (input: CreatePermissionType) =>
  apolloMutation<{ createPermission: ResponseType<PermissionType> }>(
    gql`
      mutation ($input: CreatePermissionInput!) {
        createPermission(input: $input) {
          InsertId
        }
      }
    `,
    { input },
  );

export const updatePermission = async (id: string, input: UpdatePermissionType) =>
  apolloMutation<{ updatePermission: ResponseType<PermissionType> }>(
    gql`
      mutation ($id: Float!, $input: UpdatePermissionInput!) {
        updatePermission(id: $id, input: $input) {
          RowsAffected
        }
      }
    `,
    { id, input },
  );

export const deletePermission = async (id: number) =>
  apolloMutation<{ deletePermission: ResponseType<boolean> }>(
    gql`
      mutation ($id: Float!) {
        deletePermission(id: $id) {
          RowsAffected
        }
      }
    `,
    { id },
  );
