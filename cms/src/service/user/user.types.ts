/* eslint-disable no-use-before-define */
import { FilterOperatorInput, ModeSortOperator, PaginationInput } from '@const/types';
import { RoleType } from '@service/role/role.types';

export type UserType = {
  Id?: string;
  Role?: RoleType;
  UserName?: string;
  Email?: string;
  Password?: string;
  IsAdministrator?: boolean;
  FirstName?: string;
  LastName?: string;
  FullName?: string;
  UserSections?: UserSectionType[];
};

export type UserSort = {
  Id?: ModeSortOperator;
  UserName?: ModeSortOperator;
  Email?: ModeSortOperator;
  FirstName?: ModeSortOperator;
  LastName?: ModeSortOperator;
  FullName?: ModeSortOperator;
  CreatedAt?: ModeSortOperator;
  UpdatedAt?: ModeSortOperator;
};

export type UserFilter = {
  Id?: FilterOperatorInput;
  UserName?: FilterOperatorInput;
  Email?: FilterOperatorInput;
  FirstName?: FilterOperatorInput;
  LastName?: FilterOperatorInput;
  FullName?: FilterOperatorInput;
};

export type CreateUserType = {
  Role_Ref: number;
  UserName: string;
  Email: string;
  Password: string;
  IsAdministrator?: boolean;
  FirstName?: string;
  LastName?: string;
  FullName?: string;
};

export type UpdateUserType = {
  Role_Ref: number;
  IsAdministrator?: boolean;
  FirstName?: string;
  LastName?: string;
  FullName?: string;
};

export type GetUserParams = {
  id?: number;
  filter?: UserFilter;
};

export type GetListUsersParams = {
  sort?: UserSort;
  filter?: UserFilter;
  pagination?: PaginationInput;
};

export type UserSectionType = {
  Id?: string;
  OnlineStatus?: string;
};
