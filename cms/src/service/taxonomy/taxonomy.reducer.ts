import { Pagination } from '@const/types';
import { atom, selector, selectorFamily } from 'recoil';
import { getTaxonomy, getTaxonomies } from './taxonomy.model';
import { GetListTaxonomiesParams, TaxonomyType } from './taxonomy.types';

export const forceRefreshTaxonomiesState = atom<{}>({
  key: 'forceRefreshTaxonomiesState',
  default: {},
});

export const taxonomiesState = selectorFamily<
  Pagination<TaxonomyType> | null,
  GetListTaxonomiesParams
>({
  key: 'taxonomiesState',
  get:
    (args) =>
    async ({ get }) => {
      get(forceRefreshTaxonomiesState);
      const items = await getTaxonomies(args).then((res) => res.taxonomies.Data);
      return items;
    },
});

export const taxonomyIdState = atom<number | null>({
  key: 'taxonomyIdState',
  default: null,
});

export const taxonomySelectedState = selector<TaxonomyType | null>({
  key: 'taxonomySelectedState',
  get: async ({ get }) => {
    const taxonomyId = get(taxonomyIdState);
    if (!taxonomyId) {
      return null;
    }
    const item = await getTaxonomy({ id: taxonomyId }).then((res) => res.taxonomy.Data);
    return item;
  },
});
