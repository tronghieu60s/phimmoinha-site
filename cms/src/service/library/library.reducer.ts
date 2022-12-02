import { Pagination } from '@const/types';
import { atom, selector, selectorFamily } from 'recoil';
import { getLibrary, getLibraries } from './library.model';
import { GetListLibrariesParams, LibraryType } from './library.types';

export const forceRefreshLibrariesState = atom<{}>({
  key: 'forceRefreshLibrariesState',
  default: {},
});

export const librariesState = selectorFamily<
  Pagination<LibraryType> | null,
  GetListLibrariesParams
>({
  key: 'librariesState',
  get:
    (args) =>
    async ({ get }) => {
      get(forceRefreshLibrariesState);
      const items = await getLibraries(args).then((res) => res.libraries.Data);
      return items;
    },
});

export const libraryIdState = atom<number | null>({
  key: 'libraryIdState',
  default: null,
});

export const librarySelectedState = selector<LibraryType | null>({
  key: 'librarySelectedState',
  get: async ({ get }) => {
    const libraryId = get(libraryIdState);
    if (!libraryId) {
      return null;
    }
    const item = await getLibrary({ id: libraryId }).then((res) => res.library.Data);
    return item;
  },
});
