import FormItem from '@common/Base/Form/FormItem';
import Section from '@common/Base/UI/Section';
import { TIMEOUT_DEBOUNCE } from '@const/config';
import { mapUniqueArrayByKey } from '@core/commonFuncs';
import {
  postCategoriesState,
  postsCategoriesSearchState,
  postsCategoriesState,
  postsTagsSearchState,
  postsTagsState,
  postTagsState,
} from '@service/post/post.reducer';
import { PostType } from '@service/post/post.types';
import { TaxonomyType } from '@service/taxonomy/taxonomy.types';
import { Select } from 'antd';
import { t } from 'i18next';
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  post: PostType | null;
};

export default function PostsTaxonomy(props: Props) {
  const { post } = props;

  const postTags = useRecoilValue(postTagsState(post));
  const postCategories = useRecoilValue(postCategoriesState(post));

  const { state: tagsState, contents: tags } = useRecoilValueLoadable(postsTagsState);
  const setTagsSearch = useSetRecoilState(postsTagsSearchState);
  const { state: categoriesState, contents: categories } =
    useRecoilValueLoadable(postsCategoriesState);
  const setCategoriesSearch = useSetRecoilState(postsCategoriesSearchState);

  const onSearchTags = useDebouncedCallback(setTagsSearch, TIMEOUT_DEBOUNCE);
  const onSearchCategories = useDebouncedCallback(setCategoriesSearch, TIMEOUT_DEBOUNCE);

  const tagsOptions = mapUniqueArrayByKey([...tags, ...postTags], 'Id');
  const categoriesOptions = mapUniqueArrayByKey([...categories, ...postCategories], 'Id');

  return (
    <>
      <FormItem name="Tags" label={t('posts:form.input.tag')}>
        <Select
          mode="tags"
          loading={tagsState === 'loading'}
          placeholder={t('posts:form.input.tag.placeholder')}
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
      <FormItem name="Categories" label={t('posts:form.input.category')}>
        <Select
          mode="tags"
          loading={categoriesState === 'loading'}
          placeholder={t('posts:form.input.category.placeholder')}
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
