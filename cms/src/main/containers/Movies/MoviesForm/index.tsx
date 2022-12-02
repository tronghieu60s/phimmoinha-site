import Form from '@common/Base/Form/Form';
import ResultNotFound from '@common/Base/Result/ResultNotFound';
import Section from '@common/Base/UI/Section';
import { delayLoading, isEmptyObject } from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { createMovie, updateMovie } from '@service/movie/movie.model';
import { movieState } from '@service/movie/movie.reducer';
import { CreateMovieType, UpdateMovieType } from '@service/movie/movie.types';
import { Col, Collapse, Row, Space, Spin } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { FormType, initialValues, useCurrentValues, useFormValues } from '../MoviesHooks';
import MoviesEps from './MoviesEps';
import MoviesFilm from './MoviesFilm';
import MoviesMain from './MoviesMain';
import MoviesMovie from './MoviesPost';
import MoviesSegmented from './MoviesSegmented';
import MoviesTaxonomy from './MoviesTaxonomy';

type Props = {
  id?: string;
};

export default function MoviesForm(props: Props) {
  const { id: uid } = props;
  const id = Number(uid) || 0;
  const navigate = useNavigate();

  const [form] = Form.useForm<FormType>();
  const [force, forceRender] = useState({});
  const [loading, setLoading] = useState(true);
  const [segmentedTab, setSegmentedTab] = useState<string | number>('main');

  const [errorTitle, setErrorTitle] = useState('');
  const [errorSlug, setErrorSlug] = useState('');

  const params = useMemo(
    () => ({
      id,
      filter: { Status: { Ne: 'Trash' } },
      isFilterId: true,
    }),
    [id],
  );
  const { state, contents: movie } = useRecoilValueLoadable(movieState(params));
  const onRefreshMovieState = useRecoilRefresher_UNSTABLE(movieState(params));

  const isCreate = useMemo(() => !id && isEmptyObject(movie), [id, movie]);
  const isSchedule = useMemo(
    () =>
      movie?.Status === 'Published' && moment(Number(movie?.DatePublish)).isSameOrAfter(moment()),
    [movie],
  );

  useEffect(() => {
    if (!isCreate) {
      form.setFieldsValue(useCurrentValues(movie));
      forceRender({});
    }
    setLoading(false);
  }, [form, isCreate, movie]);

  const onValidate = useCallback(async (msg) => {
    if (msg === 'VALIDATE_POST_TITLE_EXISTED') {
      setErrorTitle(t('movies:actions.exists.title'));
    }
    if (msg === 'VALIDATE_POST_SLUG_EXISTED') {
      setErrorSlug(t('movies:actions.exists.slug'));
    }
  }, []);

  const onSubmitCreate = useCallback(
    async (values) => {
      const { Status } = values;

      const input: CreateMovieType = {
        ...values,
        Status: Status === 'Draft' ? 'Published' : Status,
      };

      return createMovie(input)
        .then((res) => {
          if (res?.createMovie?.InsertId) {
            navigate(`/movies/${res.createMovie.InsertId}/update`, { replace: true });
            return notificationSuccess(t('movies:actions.create.succeed'));
          }
          return notificationError(t('movies:actions.create.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false));
    },
    [navigate, onValidate],
  );

  const onSubmitUpdate = useCallback(
    async (values) => {
      const { Status } = values;

      let status = Status;
      if (Status === 'Draft') {
        if (movie?.Status !== 'Draft') status = 'Draft';
        else status = 'Published';
      }

      const input: UpdateMovieType = {
        ...values,
        Status: status,
      };

      return updateMovie(id, input)
        .then((res) => {
          if (res?.updateMovie?.RowsAffected === 1) {
            onRefreshMovieState();
            return notificationSuccess(t('movies:actions.update.succeed'));
          }
          return notificationError(t('movies:actions.update.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false));
    },
    [id, onRefreshMovieState, onValidate, movie?.Status],
  );

  const onSubmitFinish = useCallback(
    async (o) => {
      const values = await useFormValues({
        ...o,
        Episodes: form.getFieldValue('Episodes'),
      });

      setLoading(true);
      await delayLoading();

      setErrorTitle('');
      setErrorSlug('');

      if (isCreate) {
        return onSubmitCreate(values);
      }
      return onSubmitUpdate(values);
    },
    [form, isCreate, onSubmitCreate, onSubmitUpdate],
  );

  const onDraftFinish = useCallback(async () => {
    form.validateFields().then(async (o) => {
      const values = await useFormValues(o);

      setLoading(true);
      await delayLoading();

      setErrorTitle('');
      setErrorSlug('');

      const input: CreateMovieType = {
        ...values,
        Status: 'Draft',
      };

      return createMovie(input)
        .then((res) => {
          if (res?.createMovie?.RowsAffected === 1) {
            navigate('/movies', { replace: true });
            return notificationSuccess(t('movies:actions.create.succeed'));
          }
          return notificationError(t('movies:actions.create.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false));
    });
  }, [form, navigate, onValidate]);

  const onTrashFinish = useCallback(async () => {
    setLoading(true);
    await delayLoading();

    setErrorTitle('');
    setErrorSlug('');

    const input: UpdateMovieType = {
      Status: 'Trash',
    };

    return updateMovie(id, input)
      .then((res) => {
        if (res?.updateMovie?.RowsAffected === 1) {
          navigate('/movies', { replace: true });
          return notificationSuccess(t('movies:actions.trash.succeed'));
        }
        return notificationError(t('movies:actions.trash.failed'));
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (id && !movie) {
    return <ResultNotFound />;
  }

  return (
    <Spin spinning={state === 'loading' && !isCreate}>
      <MoviesSegmented value={segmentedTab} onChange={(value) => setSegmentedTab(value)} />
      <Section />
      <Form form={form} initialValues={initialValues} onFinish={onSubmitFinish}>
        <Row justify="space-between" gutter={40}>
          <Col md={24} xl={17} hidden={segmentedTab !== 'main'}>
            <MoviesMain form={form} errorTitle={errorTitle} errorSlug={errorSlug} />
          </Col>
          <Col md={24} xl={17} hidden={segmentedTab !== 'film'}>
            <MoviesFilm form={form} movie={movie} forceRender={forceRender} />
          </Col>
          <Col md={24} xl={17} hidden={segmentedTab !== 'episodes'}>
            <MoviesEps form={form} state={state} force={force} />
          </Col>
          <Col md={24} xl={17} hidden={segmentedTab !== 'seo'}>
            Content of Tab Pane 2
          </Col>
          <Col md={24} xl={7}>
            <Space size="large" direction="vertical" className="w-100">
              <Collapse defaultActiveKey={['1', '2', '3']}>
                <Collapse.Panel key="1" header={t('movies:form.collapse.post')}>
                  <MoviesMovie
                    loading={loading}
                    isCreate={isCreate}
                    isSchedule={isSchedule}
                    onDraftFinish={onDraftFinish}
                    onTrashFinish={onTrashFinish}
                  />
                </Collapse.Panel>
              </Collapse>
              <Collapse defaultActiveKey={['1', '2', '3']}>
                <Collapse.Panel key="2" header={t('movies:form.collapse.taxonomy')}>
                  <MoviesTaxonomy movie={movie} />
                </Collapse.Panel>
              </Collapse>
              <Collapse defaultActiveKey={['1', '2', '3']}>
                <Collapse.Panel key="3" header={t('movies:form.collapse.image')}>
                  {/* <FormItem name="Avatar" label={t('movies:form.input.avatar')}>
                    <UploadImages form={form} name="Avatar" />
                  </FormItem> */}
                </Collapse.Panel>
              </Collapse>
            </Space>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}
