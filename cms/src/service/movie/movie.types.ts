import { FilterOperatorInput, PaginationInput } from '@const/types';
import { TaxonomyType } from '@service/taxonomy/taxonomy.types';
import { UserType } from '@service/user/user.types';

export type MovieMetaType = 'Movie' | 'Series';
export type MovieStatusType = 'Draft' | 'Published' | 'Trash';

export type MovieEpisodeType = {
  Id?: string;
  Key?: string;
  Title?: string;
  Slug?: string;
  Order?: number;
  Source?: string;
};

export type MovieType = {
  Id?: string;
  Code?: string;
  User?: UserType;
  Type?: MovieMetaType;
  Title?: string;
  Content?: string;
  Slug?: string;
  Status?: MovieStatusType;
  Comment?: boolean;
  Password?: string;
  Avatar?: string;
  Original?: string;
  Duration?: number;
  Quality?: string;
  Quantity?: number;
  Trailer?: string;
  Publish?: number;
  DatePublish?: number;
  DateModified?: number;
  Episodes?: MovieEpisodeType[];
  EpisodesCount?: number;
  Taxonomies?: TaxonomyType[];
};

export type MovieSort = {
  Id?: string;
  Title?: string;
  Status?: FilterOperatorInput;
};

export type MovieFilter = {
  Id?: FilterOperatorInput;
  Title?: FilterOperatorInput;
  Status?: FilterOperatorInput;
};

export type CreateMovieType = {
  Code?: string;
  Type: MovieMetaType;
  Title: string;
  Content?: string;
  Slug: string;
  Status?: MovieStatusType;
  Comment?: boolean;
  Password?: string;
  Avatar?: string;
  OriginalName?: string;
  Duration?: number;
  Quality?: string;
  Quantity?: number;
  Year?: number;
  DatePublish?: string;
  Taxonomies?: TaxonomyType[];
};

export type UpdateMovieType = {
  Code?: string;
  Title?: string;
  Content?: string;
  Slug?: string;
  Status?: MovieStatusType;
  Comment?: boolean;
  Password?: string;
  Avatar?: string;
  OriginalName?: string;
  Duration?: number;
  Quality?: string;
  Quantity?: number;
  Year?: number;
  DatePublish?: string;
  Taxonomies?: TaxonomyType[];
};

export type GetMovieParams = {
  id?: number;
  filter?: MovieFilter;
  isFilterId?: boolean;
};

export type GetListMoviesParams = {
  sort?: MovieSort;
  filter?: MovieFilter;
  pagination?: PaginationInput;
};
