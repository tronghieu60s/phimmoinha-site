import { gql } from '@apollo/client';
import { Pagination, ResponseType } from '@const/types';
import { apolloMutation, apolloQuery } from '@core/apollo';
import {
  CreateTaxonomyType,
  GetListTaxonomiesParams,
  GetTaxonomyParams,
  TaxonomyType,
  UpdateTaxonomyType,
} from './taxonomy.types';

export const CORE_TAXONOMY_FIELDS = gql`
  fragment CoreTaxonomyFields on Taxonomy {
    Id
    Type
    Name
    Slug
    Description
  }
`;

export const getTaxonomy = async (args: GetTaxonomyParams) => {
  const { id, filter } = args;

  return apolloQuery<{ taxonomy: ResponseType<TaxonomyType> }>(
    gql`
      ${CORE_TAXONOMY_FIELDS}
      query ($id: Float, $filter: TaxonomyFilter) {
        taxonomy(id: $id, filter: $filter) {
          Data {
            ...CoreTaxonomyFields
          }
        }
      }
    `,
    { id, filter },
  );
};

export const getTaxonomies = async (args: GetListTaxonomiesParams) => {
  const { sort, filter, pagination } = args;

  return apolloQuery<{ taxonomies: ResponseType<Pagination<TaxonomyType>> }>(
    gql`
      ${CORE_TAXONOMY_FIELDS}
      query ($sort: TaxonomySort, $filter: TaxonomyFilter, $pagination: PaginationInput) {
        taxonomies(sort: $sort, filter: $filter, pagination: $pagination) {
          Data {
            Items {
              ...CoreTaxonomyFields
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

export const createTaxonomy = async (input: CreateTaxonomyType) =>
  apolloMutation<{ createTaxonomy: ResponseType<TaxonomyType> }>(
    gql`
      mutation ($input: CreateTaxonomyInput!) {
        createTaxonomy(input: $input) {
          InsertId
        }
      }
    `,
    { input },
  );

export const updateTaxonomy = async (id: string, input: UpdateTaxonomyType) =>
  apolloMutation<{ updateTaxonomy: ResponseType<TaxonomyType> }>(
    gql`
      mutation ($id: Float!, $input: UpdateTaxonomyInput!) {
        updateTaxonomy(id: $id, input: $input) {
          RowsAffected
        }
      }
    `,
    { id, input },
  );

export const deleteManyTaxonomies = async (ids: number[]) =>
  apolloMutation<{ deleteManyTaxonomies: ResponseType<boolean> }>(
    gql`
      mutation ($ids: [Float!]!) {
        deleteManyTaxonomies(ids: $ids) {
          RowsAffected
        }
      }
    `,
    { ids },
  );
