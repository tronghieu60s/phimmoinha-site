import { FilterOperatorInput, ModeSortOperator, PaginationInput } from '@const/types';

export type LibraryType = {
  Id?: number;
  Type?: string;
  Key?: string;
  Value?: string;
  Color?: string;
};

export type LibrarySort = {
  Id?: ModeSortOperator;
  Type?: ModeSortOperator;
  Key?: ModeSortOperator;
  Value?: ModeSortOperator;
};

export type LibraryFilter = {
  Id?: FilterOperatorInput;
  Type?: FilterOperatorInput;
  Key?: FilterOperatorInput;
  Value?: FilterOperatorInput;
};

export type CreateLibraryType = {
  Type: string;
  Key: string;
  Value?: string;
};

export type UpdateLibraryType = {
  Value?: string;
};

export type GetLibraryParams = {
  id?: number;
  filter?: LibraryFilter;
};

export type GetListLibrariesParams = {
  sort?: LibrarySort;
  filter?: LibraryFilter;
  pagination?: PaginationInput;
};
