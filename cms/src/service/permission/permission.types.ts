import { FilterOperatorInput, ModeSortOperator, PaginationInput } from '@const/types';

export type PermissionType = {
  Id?: number;
  Name?: string;
  Description?: string;
};

export type PermissionSort = {
  Id?: ModeSortOperator;
  Name?: ModeSortOperator;
  Description?: ModeSortOperator;
  CreatedAt?: ModeSortOperator;
  UpdatedAt?: ModeSortOperator;
};

export type PermissionFilter = {
  Id?: FilterOperatorInput;
  Name?: FilterOperatorInput;
  Description?: FilterOperatorInput;
};

export type CreatePermissionType = {
  Name: string;
  Description?: string;
};

export type UpdatePermissionType = {
  Name?: string;
  Description?: string;
};

export type GetPermissionParams = {
  id?: number;
  filter?: PermissionFilter;
};

export type GetListPermissionsParams = {
  sort?: PermissionSort;
  filter?: PermissionFilter;
  pagination?: PaginationInput;
};
