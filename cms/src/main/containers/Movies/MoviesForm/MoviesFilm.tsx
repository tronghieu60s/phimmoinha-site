import { FormInputDatePicker, FormInputNumber, FormInputText } from '@common/Base/Form/FormInput';
import FormItem from '@common/Base/Form/FormItem';
import { TIMEOUT_DEBOUNCE } from '@const/config';
import { mapUniqueArrayByKey } from '@core/commonFuncs';
import {
  movieCastsState,
  movieCountriesState,
  movieDirectorsState,
  moviesCastsSearchState,
  moviesCastsState,
  moviesCountriesSearchState,
  moviesCountriesState,
  moviesDirectorsSearchState,
  moviesDirectorsState,
} from '@service/movie/movie.reducer';
import { MovieType } from '@service/movie/movie.types';
import { TaxonomyType } from '@service/taxonomy/taxonomy.types';
import { Col, FormInstance, Row, Select, Space, Typography } from 'antd';
import { t } from 'i18next';
import { useCallback } from 'react';
import ReactPlayer from 'react-player';
import { useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  form: FormInstance<any>;
  movie: MovieType | null;
  forceRender: (obj: object) => void;
};

export default function MoviesFilm(props: Props) {
  const { form, movie, forceRender } = props;

  const movieCasts = useRecoilValue(movieCastsState(movie));
  const movieDirectors = useRecoilValue(movieDirectorsState(movie));
  const movieCountries = useRecoilValue(movieCountriesState(movie));

  const { state: castsState, contents: casts } = useRecoilValueLoadable(moviesCastsState);
  const setCastsSearch = useSetRecoilState(moviesCastsSearchState);
  const { state: directorsState, contents: directors } =
    useRecoilValueLoadable(moviesDirectorsState);
  const setDirectorsSearch = useSetRecoilState(moviesDirectorsSearchState);
  const { state: countriesState, contents: countries } =
    useRecoilValueLoadable(moviesCountriesState);
  const setCountriesSearch = useSetRecoilState(moviesCountriesSearchState);

  const onSearchCasts = useDebouncedCallback(setCastsSearch, TIMEOUT_DEBOUNCE);
  const onSearchDirectors = useDebouncedCallback(setDirectorsSearch, TIMEOUT_DEBOUNCE);
  const onSearchCountries = useDebouncedCallback(setCountriesSearch, TIMEOUT_DEBOUNCE);

  const castsOptions = mapUniqueArrayByKey([...casts, ...movieCasts], 'Id');
  const directorsOptions = mapUniqueArrayByKey([...directors, ...movieDirectors], 'Id');
  const countriesOptions = mapUniqueArrayByKey([...countries, ...movieCountries], 'Id');

  const onChangeType = useCallback(() => {
    const Type = form.getFieldValue('Type');
    if (Type === 'Movie') form.setFieldsValue({ Quantity: 1 });
    forceRender({});
  }, [forceRender, form]);

  return (
    <Row justify="start" className="px-2" gutter={40}>
      <Col span={12}>
        <FormItem name="Original" label={t('movies:form.input.title.original')}>
          <FormInputText />
        </FormItem>
      </Col>
      <Col span={24} />
      <Col span={8}>
        <FormItem name="Type" label={t('movies:form.input.type')}>
          <Select placeholder={t('movies:form.input.type.placeholder')} onChange={onChangeType}>
            <Select.Option key="Movie">{t('movies:form.input.type.movie')}</Select.Option>
            <Select.Option key="Series">{t('movies:form.input.type.series')}</Select.Option>
          </Select>
        </FormItem>
      </Col>
      <Col span={8}>
        <FormItem name="Quality" label={t('movies:form.input.quality')}>
          <FormInputText />
        </FormItem>
      </Col>
      <Col span={24} />
      <Col span={8}>
        <FormItem name="Quantity" label={t('movies:form.input.quantity')}>
          <FormInputNumber placeholder="0" disabled={form.getFieldValue('Type') === 'Movie'} />
        </FormItem>
      </Col>
      <Col span={8}>
        <Space align="end">
          <FormItem
            name="Duration"
            label={t('movies:form.input.episode.duration')}
            className="mb-0"
          >
            <FormInputNumber placeholder="0" />
          </FormItem>
          <Typography.Text>{`(${t('movies:form.input.episode.duration.unit')})`}</Typography.Text>
        </Space>
      </Col>
      <Col span={8}>
        <FormItem name="Publish" label={t('movies:form.input.publish')}>
          <FormInputDatePicker picker="year" className="w-100" />
        </FormItem>
      </Col>
      <Col span={12}>
        <FormItem name="Trailer" label={t('movies:form.input.trailer')}>
          <FormInputText onChange={() => forceRender({})} />
        </FormItem>
      </Col>
      <Col span={24}>
        <ReactPlayer
          width="100%"
          url={form.getFieldValue('Trailer') || 'https://youtu.be/SC7BfxpWieM'}
          className="mb-4"
        />
      </Col>
      <Col span={24}>
        <Row justify="space-between" gutter={40}>
          <Col span={8}>
            <FormItem name="Countries" label={t('movies:form.input.country')}>
              <Select
                mode="tags"
                loading={countriesState === 'loading'}
                placeholder={t('movies:form.input.country.placeholder')}
                showArrow
                filterOption={false}
                onSearch={onSearchCountries}
                options={
                  (Array.isArray(countries) &&
                    countriesOptions?.map((o: TaxonomyType) => ({ label: o.Name, value: o.Id }))) ||
                  []
                }
                onBlur={() => setCountriesSearch('')}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem name="Directors" label={t('movies:form.input.director')}>
              <Select
                mode="tags"
                loading={directorsState === 'loading'}
                placeholder={t('movies:form.input.director.placeholder')}
                showArrow
                filterOption={false}
                onSearch={onSearchDirectors}
                options={
                  (Array.isArray(directors) &&
                    directorsOptions?.map((o: TaxonomyType) => ({ label: o.Name, value: o.Id }))) ||
                  []
                }
                onBlur={() => setDirectorsSearch('')}
              />
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem name="Casts" label={t('movies:form.input.cast')}>
              <Select
                mode="tags"
                loading={castsState === 'loading'}
                placeholder={t('movies:form.input.cast.placeholder')}
                showArrow
                filterOption={false}
                onSearch={onSearchCasts}
                options={
                  (Array.isArray(casts) &&
                    castsOptions?.map((o: TaxonomyType) => ({ label: o.Name, value: o.Id }))) ||
                  []
                }
                onBlur={() => setCastsSearch('')}
              />
            </FormItem>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
