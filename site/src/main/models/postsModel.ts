import { gql } from '@apollo/client';
import { GetDocParams, GetListPostsParams, Pagination, PostType, ResponseType } from '@const/types';
import { apolloQuery } from '@core/apollo';

export const CORE_POSTS_FIELDS = gql`
  fragment CorePostsFields on Posts {
    _id
    meta
    terms
    post_parent
    post_title
    post_content
    post_slug
    post_excerpt
    post_type
    post_status
    post_comment
    post_date
    post_modified
  }
`;

export const getPost = async (args: GetDocParams<PostType>) => {
  const { id, params } = args;

  return apolloQuery<{
    getPost: ResponseType<PostType>;
  }>(
    gql`
      ${CORE_POSTS_FIELDS}
      query ($id: ID, $params: JSON) {
        getPost(id: $id, params: $params) {
          data {
            ...CorePostsFields
          }
        }
      }
    `,
    { id, params },
  );
};

export const getPosts = async (args: GetListPostsParams) => {
  const { params = {} } = args;
  const { search, page, pageSize, order, orderby, loadAll, loadMore } = params;

  return apolloQuery<{
    getPosts: ResponseType<Pagination<PostType>>;
  }>(
    gql`
      ${CORE_POSTS_FIELDS}
      query (
        $search: JSON
        $page: Int
        $pageSize: Int
        $order: FieldsOrderEnum
        $orderby: PostsFieldsOrderEnum
        $loadAll: Boolean
        $loadMore: Boolean
      ) {
        getPosts(
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
              ...CorePostsFields
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
