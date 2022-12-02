import FormItem from '@common/Base/Form/FormItem';
import Section from '@common/Base/UI/Section';
import { TIMEOUT_DEBOUNCE } from '@const/config';
import { mapUniqueArrayByKey } from '@core/commonFuncs';
import {
  movieCategoriesState,
  moviesCategoriesSearchState,
  moviesCategoriesState,
  moviesTagsSearchState,
  moviesTagsState,
  movieTagsState,
} from '@service/movie/movie.reducer';
import { MovieType } from '@service/movie/movie.types';
import { TaxonomyType } from '@service/taxonomy/taxonomy.types';
import { Select } from 'antd';
import { t } from 'i18next';
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  movie: MovieType | null;
};

export default function MoviesTaxonomy(props: Props) {
  const { movie } = props;

  const movieTags = useRecoilValue(movieTagsState(movie));
  const movieCategories = useRecoilValue(movieCategoriesState(movie));

  const { state: tagsState, contents: tags } = useRecoilValueLoadable(moviesTagsState);
  const setTagsSearch = useSetRecoilState(moviesTagsSearchState);
  const { state: categoriesState, contents: categories } =
    useRecoilValueLoadable(moviesCategoriesState);
  const setCategoriesSearch = useSetRecoilState(moviesCategoriesSearchState);

  const onSearchTags = useDebouncedCallback(setTagsSearch, TIMEOUT_DEBOUNCE);
  const onSearchCategories = useDebouncedCallback(setCategoriesSearch, TIMEOUT_DEBOUNCE);

  const tagsOptions = mapUniqueArrayByKey([...tags, ...movieTags], 'Id');
  const categoriesOptions = mapUniqueArrayByKey([...categories, ...movieCategories], 'Id');

  return (
    <>
      <FormItem name="Tags" label={t('movies:form.input.tag')}>
        <Select
          mode="tags"
          loading={tagsState === 'loading'}
          placeholder={t('movies:form.input.tag.placeholder')}
          showArrow
          filterOption={false}
          onSearch={onSearchTags}
          options={
            (Array.isArray(tags) &&
              tagsOptions?.map((o: TaxonomyType) => ({ label: o.Name, value: o.Id }))) ||
            []
          }
          onBlur={() => setTagsSearch('')}
        />
      </FormItem>
      <Section />
      <FormItem name="Categories" label={t('movies:form.input.category')}>
        <Select
          mode="tags"
          loading={categoriesState === 'loading'}
          placeholder={t('movies:form.input.category.placeholder')}
          showArrow
          filterOption={false}
          onSearch={onSearchCategories}
          options={
            (Array.isArray(tags) &&
              categoriesOptions?.map((o: TaxonomyType) => ({ label: o.Name, value: o.Id }))) ||
            []
          }
          onBlur={() => setCategoriesSearch('')}
        />
      </FormItem>
    </>
  );
}
