import { gql } from '@apollo/client';
import { Pagination, ResponseType } from '@const/types';
import { apolloMutation, apolloQuery } from '@core/apollo';
import {
  CreatePostType,
  GetListPostsParams,
  GetPostParams,
  PostType,
  UpdatePostType,
} from './post.types';

export const CORE_POST_FIELDS = gql`
  fragment CorePostFields on Post {
    Id
    User {
      Id
      UserName
    }
    Type
    Title
    Content
    Slug
    Status
    Views
    Comment
    Password
    Avatar
    DatePublish
    DateModified
    Taxonomies {
      Id
      Type
      Name
    }
  }
`;

export const getPost = async (args: GetPostParams) => {
  const { id, filter, isFilterId = false } = args;

  return apolloQuery<{ post: ResponseType<PostType> }>(
    gql`
      ${CORE_POST_FIELDS}
      query ($id: Float, $filter: PostFilter, $isFilterId: Boolean) {
        post(id: $id, filter: $filter, isFilterId: $isFilterId) {
          Data {
            ...CorePostFields
          }
        }
      }
    `,
    { id, filter, isFilterId },
  );
};

export const getPosts = async (args: GetListPostsParams) => {
  const { sort, filter, pagination } = args;

  return apolloQuery<{ posts: ResponseType<Pagination<PostType>> }>(
    gql`
      ${CORE_POST_FIELDS}
      query ($sort: PostSort, $filter: PostFilter, $pagination: PaginationInput) {
        posts(sort: $sort, filter: $filter, pagination: $pagination) {
          Data {
            Items {
              ...CorePostFields
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

export const createPost = async (input: CreatePostType) =>
  apolloMutation<{ createPost: ResponseType<PostType> }>(
    gql`
      mutation ($input: CreatePostInput!) {
        createPost(input: $input) {
          InsertId
        }
      }
    `,
    { input },
  );

export const updatePost = async (id: number, input: UpdatePostType) =>
  apolloMutation<{ updatePost: ResponseType<PostType> }>(
    gql`
      mutation ($id: Float!, $input: UpdatePostInput!) {
        updatePost(id: $id, input: $input) {
          RowsAffected
        }
      }
    `,
    { id, input },
  );

export const deleteManyPosts = async (ids: number[]) =>
  apolloMutation<{ deleteManyPosts: ResponseType<boolean> }>(
    gql`
      mutation ($ids: [Float!]!) {
        deleteManyPosts(ids: $ids) {
          RowsAffected
        }
      }
    `,
    { ids },
  );

export const deleteTrashPosts = async () =>
  apolloMutation<{ deleteTrashPosts: ResponseType<boolean> }>(
    gql`
      mutation {
        deleteTrashPosts {
          RowsAffected
        }
      }
    `,
    {},
  );

export const restoreManyPosts = async (ids: string[]) =>
  apolloMutation<{ restoreManyPosts: ResponseType<boolean> }>(
    gql`
      mutation ($ids: [Float!]!) {
        restoreManyPosts(ids: $ids) {
          RowsAffected
        }
      }
    `,
    { ids },
  );
