/* eslint-disable no-use-before-define */
/* Root Types */

export type ResponseType<T = any> = {
  data: T | null;
  insertId?: string | null;
  rowsAffected?: number | null;
};

export type ResponseCommon = {
  status?: number;
  success?: boolean;
  message?: string;
  results?: ResponseType;
};

export type ResponseError = ResponseCommon & {
  errors?: Error | ResponseError;
};

export type Pagination<T = any> = {
  items: T[];
  pagination?: PaginationType;
};

export type PaginationType = {
  total: number;
  pageTotal: number;
  page: number;
  pageSize: number;
  nextPage?: number;
  previousPage?: number;
};

export type BreadcrumbType = {
  path: string;
  label: string;
};

export type ServerWatchType = 'fbo' | 'hydrax';

/* Common Types */

export type GetDocParams<T> = {
  id?: string;
  params?: T;
};

export type GetListParams<T> = {
  ids?: string[];
  params?: {
    search?: T | any;
    page?: number;
    pageSize?: number;
    order?: 'asc' | 'desc';
    orderby?: string;
    loadAll?: boolean;
    loadMore?: boolean;
  };
};

/* User Types */

export type UserRoleType = 'admin' | 'member' | 'editor';
export type UserMetaType = {
  user_last_name?: string;
  user_first_name?: string;
  user_nickname?: string;
  user_description?: string;
};
export type UserStatusType = 'active' | 'inactive' | 'banned';

export type UserType = {
  _id?: string;
  meta?: UserMetaType;
  user_login?: string;
  user_pass?: string;
  user_email?: string;
  user_registered?: string;
  user_role?: UserRoleType;
  user_status?: UserStatusType;
};

/* Post Types */

export type PostMetaType = {
  post_avatar?: string;
};
export type PostTaxonomyType = 'post' | 'page';
export type PostStatusType = 'pending' | 'private' | 'publish' | 'draft' | 'trash';
export type PostCommentType = 'open' | 'closed';

export type PostType = {
  _id?: string;
  terms?: TermType[];
  meta?: PostMetaType;
  post_parent?: string;
  post_title?: string;
  post_content?: string;
  post_slug?: string;
  post_excerpt?: string;
  post_type?: PostTaxonomyType;
  post_status?: PostStatusType;
  post_comment?: PostCommentType;
  post_date?: string;
  post_modified?: string;
};

export type GetListPostsParams = GetListParams<PostType> & {
  params?: {
    orderby?: 'post_title' | 'term_slug' | 'created_at' | 'updated_at';
  };
};

/* Movie Types */

export type MovieMetaType = {
  movie_avatar?: string;
  movie_duration?: number;
  movie_episode?: number;
  movie_original?: string;
  movie_quality?: string;
  movie_trailer?: string;
  movie_publish?: number;
};
export type MovieTaxonomyType = 'movie' | 'series';
export type MovieStatusType = 'pending' | 'private' | 'publish' | 'draft' | 'trash';
export type MovieCommentType = 'open' | 'closed';
export type MovieEpisodeType = {
  _id?: string;
  episode_name?: string;
  episode_slug?: string;
  episode_server?: {
    episode_server_fbo?: string;
    episode_server_hydrax?: string;
  };
  episode_date?: string;
};

export type MovieType = {
  _id?: string;
  terms?: TermType[];
  meta?: MovieMetaType;
  movie_parent?: string;
  movie_title?: string;
  movie_content?: string;
  movie_slug?: string;
  movie_excerpt?: string;
  movie_type?: MovieTaxonomyType;
  movie_status?: MovieStatusType;
  movie_comment?: MovieCommentType;
  movie_episodes?: MovieEpisodeType[];
  movie_date?: string;
  movie_modified?: string;
};

export type GetListMoviesParams = GetListParams<MovieType> & {
  params?: {
    orderby?: 'movie_title' | 'movie_slug' | 'created_at' | 'updated_at';
  };
};

/* Term Types */

export type TermMetaType = {
  term_color?: string;
  term_description?: string;
};
export type TermTaxonomyType =
  | 'post_category'
  | 'movie_category'
  | 'post_tag'
  | 'movie_tag'
  | 'movie_country'
  | 'movie_director'
  | 'movie_actor';

export type TermType = {
  _id?: string;
  meta?: TermMetaType;
  term_parent?: string | null;
  term_name?: string;
  term_slug?: string;
  term_taxonomy?: TermTaxonomyType;
};

export type GetListTermsParams = GetListParams<TermType> & {
  params?: {
    orderby?: 'term_name' | 'term_slug' | 'created_at' | 'updated_at';
  };
};

/* Option Types */

export type OptionType = {
  _id?: string;
  option_name?: string;
  option_value?: any;
};

export type OptionMenuType = {
  _id?: string;
  menu_path?: string;
  menu_title?: string;
  menu_content?: OptionMenuItemType[];
};

export type OptionMenuItemType = {
  _id?: string;
  menu_path?: string;
  menu_title?: string;
};

/* Report Types */

export type ReportParams = {
  id?: string;
  report_reason?: string;
};
