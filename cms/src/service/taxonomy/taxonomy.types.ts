import { FilterOperatorInput, ModeSortOperator, PaginationInput } from '@const/types';

export type TaxonomyMetaType =
  | 'Cast'
  | 'Director'
  | 'Country'
  | 'Post_Category'
  | 'Movie_Category'
  | 'Tag';

export type TaxonomyType = {
  Id?: string;
  Type?: TaxonomyMetaType;
  Name?: string;
  Slug?: string;
  Description?: string;
};

export type TaxonomySort = {
  Id?: ModeSortOperator;
  Name?: ModeSortOperator;
  Slug?: ModeSortOperator;
  Description?: ModeSortOperator;
  CreatedAt?: ModeSortOperator;
  UpdatedAt?: ModeSortOperator;
};

export type TaxonomyFilter = {
  Id?: FilterOperatorInput;
  Type?: FilterOperatorInput;
  Name?: FilterOperatorInput;
  Slug?: FilterOperatorInput;
  Description?: FilterOperatorInput;
};

export type CreateTaxonomyType = {
  Type: TaxonomyMetaType;
  Name: string;
  Slug?: string;
  Description?: string;
};

export type UpdateTaxonomyType = {
  Name?: string;
  Slug?: string;
  Description?: string;
};

export type GetTaxonomyParams = {
  id?: number;
  filter?: TaxonomyFilter;
};

export type GetListTaxonomiesParams = {
  sort?: TaxonomySort;
  filter?: TaxonomyFilter;
  pagination?: PaginationInput;
};
