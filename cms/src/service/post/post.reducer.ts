import { Pagination } from '@const/types';
import { convertArrayToObject } from '@core/commonFuncs';
import { getLibraries } from '@service/library/library.model';
import { LibraryType } from '@service/library/library.types';
import { getTaxonomies } from '@service/taxonomy/taxonomy.model';
import { TaxonomyType } from '@service/taxonomy/taxonomy.types';
import { atom, selector, selectorFamily } from 'recoil';
import { getPost, getPosts } from './post.model';
import { GetListPostsParams, GetPostParams, PostType } from './post.types';

export const postState = selectorFamily<PostType | null, GetPostParams>({
  key: 'postState',
  get: (filter) => async () => {
    const item = await getPost(filter).then((res) => res.post.Data);
    return item;
  },
});

export const postsState = selectorFamily<Pagination<PostType> | null, GetListPostsParams>({
  key: 'postsState',
  get: (args) => async () => {
    const item = await getPosts(args).then((res) => res.posts.Data);
    return item;
  },
});

export const postTagsState = selectorFamily<TaxonomyType[], PostType | null>({
  key: 'postTagsState',
  get: (post) => async () => {
    const items = post?.Taxonomies?.filter((item) => item.Type === 'Tag') || [];
    return items;
  },
});

export const postCategoriesState = selectorFamily<TaxonomyType[], PostType | null>({
  key: 'postCategoriesState',
  get: (post) => async () => {
    const items = post?.Taxonomies?.filter((item) => item.Type === 'Post_Category') || [];
    return items;
  },
});

/* Select */

export const postsTagsSearchState = atom<string>({
  key: 'postsTagsSearchState',
  default: '',
});

export const postsTagsState = selector<TaxonomyType[]>({
  key: 'postsTagsState',
  get: async ({ get }) => {
    const search = get(postsTagsSearchState);
    const item = await getTaxonomies({
      filter: { Type: { Eq: 'Tag' }, Name: { Ct: search } },
    }).then((res) => res.taxonomies.Data);
    return item?.Items || [];
  },
});

export const postsCategoriesSearchState = atom<string>({
  key: 'postsCategoriesSearchState',
  default: '',
});

export const postsCategoriesState = selector<TaxonomyType[]>({
  key: 'postsCategoriesState',
  get: async ({ get }) => {
    const search = get(postsCategoriesSearchState);
    const item = await getTaxonomies({
      filter: { Type: { Eq: 'Post_Category' }, Name: { Ct: search } },
    }).then((res) => res.taxonomies.Data);
    return item?.Items || [];
  },
});

/* Library Text */

export const postLibrariesState = atom<Pagination<LibraryType>>({
  key: 'postLibrariesState',
  default: (async () => {
    const items = await getLibraries({ filter: { Type: { Stw: 'Post' } } }).then(
      (res) => res.libraries.Data,
    );
    return items;
  })(),
});

export const postStatusTextState = selector<{ [key: string]: string }[]>({
  key: 'postStatusTextState',
  get: ({ get }) => {
    const libraries = get(postLibrariesState);
    const items = libraries.Items.filter((item) => item.Type === 'PostStatus');
    return convertArrayToObject(items, 'Key');
  },
});
