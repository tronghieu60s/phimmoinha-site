import { gql } from '@apollo/client';
import { GetDocParams, GetListTermsParams, Pagination, ResponseType, TermType } from '@const/types';
import { apolloQuery } from '@core/apollo';

export const CORE_TERMS_FIELDS = gql`
  fragment CoreTermsFields on Terms {
    _id
    meta
    term_parent
    term_name
    term_slug
    term_taxonomy
  }
`;

export const getTerm = async (args: GetDocParams<TermType>) => {
  const { id, params } = args;

  return apolloQuery<{
    getTerm: ResponseType<TermType>;
  }>(
    gql`
      ${CORE_TERMS_FIELDS}
      query ($id: ID, $params: JSON) {
        getTerm(id: $id, params: $params) {
          data {
            ...CoreTermsFields
          }
        }
      }
    `,
    { id, params },
  );
};

export const getTerms = async (args: GetListTermsParams) => {
  const { params = {} } = args;
  const { search, page, pageSize, order, orderby, loadAll, loadMore } = params;

  return apolloQuery<{
    getTerms: ResponseType<Pagination<TermType>>;
  }>(
    gql`
      ${CORE_TERMS_FIELDS}
      query (
        $search: JSON
        $page: Int
        $pageSize: Int
        $order: FieldsOrderEnum
        $orderby: TermsFieldsOrderEnum
        $loadAll: Boolean
        $loadMore: Boolean
      ) {
        getTerms(
          params: {
            search: $search
            page: $page
            pageSize: $pageSize
            order: $order
            orderby: $orderby
            loadAll: $loadAll
            loadMore: $loadMore
          }
        ) {
          data {
            items {
              ...CoreTermsFields
            }
            pagination {
              total
              pageTotal
              page
              pageSize
            }
          }
        }
      }
    `,
    { search, page, pageSize, order, orderby, loadAll, loadMore },
  );
};
