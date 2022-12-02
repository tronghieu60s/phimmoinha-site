import { Pagination } from '@const/types';
import { convertArrayToObject } from '@core/commonFuncs';
import { getLibraries } from '@service/library/library.model';
import { LibraryType } from '@service/library/library.types';
import { getTaxonomies } from '@service/taxonomy/taxonomy.model';
import { TaxonomyType } from '@service/taxonomy/taxonomy.types';
import { atom, selector, selectorFamily } from 'recoil';
import { getMovie, getMovies } from './movie.model';
import { GetListMoviesParams, GetMovieParams, MovieType } from './movie.types';

export const movieState = selectorFamily<MovieType | null, GetMovieParams>({
  key: 'movieState',
  get: (filter) => async () => {
    const item = await getMovie(filter).then((res) => res.movie.Data);
    return item;
  },
});

export const moviesState = selectorFamily<Pagination<MovieType> | null, GetListMoviesParams>({
  key: 'moviesState',
  get: (args) => async () => {
    const item = await getMovies(args).then((res) => res.movies.Data);
    return item;
  },
});

export const movieTagsState = selectorFamily<TaxonomyType[], MovieType | null>({
  key: 'movieTagsState',
  get: (movie) => async () => {
    const items = movie?.Taxonomies?.filter((item) => item.Type === 'Tag') || [];
    return items;
  },
});

export const movieCategoriesState = selectorFamily<TaxonomyType[], MovieType | null>({
  key: 'movieCategoriesState',
  get: (movie) => async () => {
    const items = movie?.Taxonomies?.filter((item) => item.Type === 'Movie_Category') || [];
    return items;
  },
});

export const movieCastsState = selectorFamily<TaxonomyType[], MovieType | null>({
  key: 'movieCastsState',
  get: (movie) => async () => {
    const items = movie?.Taxonomies?.filter((item) => item.Type === 'Cast') || [];
    return items;
  },
});

export const movieDirectorsState = selectorFamily<TaxonomyType[], MovieType | null>({
  key: 'movieDirectorsState',
  get: (movie) => async () => {
    const items = movie?.Taxonomies?.filter((item) => item.Type === 'Director') || [];
    return items;
  },
});

export const movieCountriesState = selectorFamily<TaxonomyType[], MovieType | null>({
  key: 'movieCountriesState',
  get: (movie) => async () => {
    const items = movie?.Taxonomies?.filter((item) => item.Type === 'Country') || [];
    return items;
  },
});

/* Select */

export const moviesTagsSearchState = atom<string>({
  key: 'moviesTagsSearchState',
  default: '',
});

export const moviesTagsState = selector<TaxonomyType[]>({
  key: 'moviesTagsState',
  get: async ({ get }) => {
    const search = get(moviesTagsSearchState);
    const item = await getTaxonomies({
      filter: { Type: { Eq: 'Tag' }, Name: { Ct: search } },
    }).then((res) => res.taxonomies.Data);
    return item?.Items || [];
  },
});

export const moviesCategoriesSearchState = atom<string>({
  key: 'moviesCategoriesSearchState',
  default: '',
});

export const moviesCategoriesState = selector<TaxonomyType[]>({
  key: 'moviesCategoriesState',
  get: async ({ get }) => {
    const search = get(moviesCategoriesSearchState);
    const item = await getTaxonomies({
      filter: { Type: { Eq: 'Movie_Category' }, Name: { Ct: search } },
    }).then((res) => res.taxonomies.Data);
    return item?.Items || [];
  },
});

export const moviesCastsSearchState = atom<string>({
  key: 'moviesCastsSearchState',
  default: '',
});

export const moviesCastsState = selector<TaxonomyType[]>({
  key: 'moviesCastsState',
  get: async ({ get }) => {
    const search = get(moviesCastsSearchState);
    const item = await getTaxonomies({
      filter: { Type: { Eq: 'Cast' }, Name: { Ct: search } },
    }).then((res) => res.taxonomies.Data);
    return item?.Items || [];
  },
});

export const moviesDirectorsSearchState = atom<string>({
  key: 'moviesDirectorsSearchState',
  default: '',
});

export const moviesDirectorsState = selector<TaxonomyType[]>({
  key: 'moviesDirectorsState',
  get: async ({ get }) => {
    const search = get(moviesDirectorsSearchState);
    const item = await getTaxonomies({
      filter: { Type: { Eq: 'Director' }, Name: { Ct: search } },
    }).then((res) => res.taxonomies.Data);
    return item?.Items || [];
  },
});

export const moviesCountriesSearchState = atom<string>({
  key: 'moviesCountriesSearchState',
  default: '',
});

export const moviesCountriesState = selector<TaxonomyType[]>({
  key: 'moviesCountriesState',
  get: async ({ get }) => {
    const search = get(moviesCountriesSearchState);
    const item = await getTaxonomies({
      filter: { Type: { Eq: 'Country' }, Name: { Ct: search } },
    }).then((res) => res.taxonomies.Data);
    return item?.Items || [];
  },
});

/* Library Text */

export const movieLibrariesState = atom<Pagination<LibraryType>>({
  key: 'movieLibrariesState',
  default: (async () => {
    const items = await getLibraries({ filter: { Type: { Stw: 'Movie' } } }).then(
      (res) => res.libraries.Data,
    );
    return items;
  })(),
});

export const movieTypeTextState = selector<{ [key: string]: string }[]>({
  key: 'movieTypeTextState',
  get: ({ get }) => {
    const libraries = get(movieLibrariesState);
    const items = libraries.Items.filter((item) => item.Type === 'MovieType');
    return convertArrayToObject(items, 'Key');
  },
});

export const movieStatusTextState = selector<{ [key: string]: string }[]>({
  key: 'movieStatusTextState',
  get: ({ get }) => {
    const libraries = get(movieLibrariesState);
    const items = libraries.Items.filter((item) => item.Type === 'MovieStatus');
    return convertArrayToObject(items, 'Key');
  },
});
