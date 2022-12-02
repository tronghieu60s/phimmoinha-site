import { FilterOperatorInput, PaginationInput } from '@const/types';
import { TaxonomyType } from '@service/taxonomy/taxonomy.types';
import { UserType } from '@service/user/user.types';

export type PostMetaType = 'Post' | 'Page';
export type PostStatusType = 'Draft' | 'Published' | 'Trash';

export type PostType = {
  Id?: string;
  Code?: string;
  User?: UserType;
  Type?: PostMetaType;
  Title?: string;
  Content?: string;
  Slug?: string;
  Status?: PostStatusType;
  Comment?: boolean;
  Password?: string;
  Avatar?: string;
  DatePublish?: number;
  DateModified?: number;
  Taxonomies?: TaxonomyType[];
};

export type PostSort = {
  Id?: string;
  Title?: string;
  Status?: FilterOperatorInput;
};

export type PostFilter = {
  Id?: FilterOperatorInput;
  Title?: FilterOperatorInput;
  Status?: FilterOperatorInput;
};

export type CreatePostType = {
  Code?: string;
  Type: PostMetaType;
  Title: string;
  Content?: string;
  Slug: string;
  Status?: PostStatusType;
  Comment?: boolean;
  Password?: string;
  Avatar?: string;
  DatePublish?: string;
  Taxonomies?: TaxonomyType[];
};

export type UpdatePostType = {
  Code?: string;
  Title?: string;
  Content?: string;
  Slug?: string;
  Status?: PostStatusType;
  Comment?: boolean;
  Password?: string;
  Avatar?: string;
  DatePublish?: string;
  Taxonomies?: TaxonomyType[];
};

export type GetPostParams = {
  id?: number;
  filter?: PostFilter;
  isFilterId?: boolean;
};

export type GetListPostsParams = {
  sort?: PostSort;
  filter?: PostFilter;
  pagination?: PaginationInput;
};
