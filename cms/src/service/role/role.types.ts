import { FilterOperatorInput, ModeSortOperator, PaginationInput } from '@const/types';
import { PermissionType } from '@service/permission/permission.types';

export type RoleType = {
  Id?: number;
  Name?: string;
  Description?: string;
  Permissions?: PermissionType[];
};

export type RoleSort = {
  Id?: ModeSortOperator;
  Name?: ModeSortOperator;
  Description?: ModeSortOperator;
  CreatedAt?: ModeSortOperator;
  UpdatedAt?: ModeSortOperator;
};

export type RoleFilter = {
  Id?: FilterOperatorInput;
  Name?: FilterOperatorInput;
  Description?: FilterOperatorInput;
};

export type CreateRoleType = {
  Name: string;
  Description?: string;
};

export type UpdateRoleType = {
  Name?: string;
  Description?: string;
};

export type GetRoleParams = {
  id?: number;
  filter?: RoleFilter;
};

export type GetListRolesParams = {
  sort?: RoleSort;
  filter?: RoleFilter;
  pagination?: PaginationInput;
};
