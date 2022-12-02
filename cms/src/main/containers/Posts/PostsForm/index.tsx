import Form from '@common/Base/Form/Form';
import ResultNotFound from '@common/Base/Result/ResultNotFound';
import Section from '@common/Base/UI/Section';
import { delayLoading, isEmptyObject } from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { createPost, updatePost } from '@service/post/post.model';
import { postState } from '@service/post/post.reducer';
import { CreatePostType, PostMetaType, UpdatePostType } from '@service/post/post.types';
import { Col, Collapse, Row, Space, Spin } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { FormType, initialValues, useCurrentValues, useFormValues } from '../PostsHooks';
import PostsMain from './PostsMain';
import PostsPost from './PostsPost';
import PostsSegmented from './PostsSegmented';
import PostsTaxonomy from './PostsTaxonomy';

type Props = {
  id?: string;
  query: {
    type: PostMetaType;
  };
};

export default function PostsForm(props: Props) {
  const {
    id: uid,
    query: { type },
  } = props;
  const id = Number(uid) || 0;
  const navigate = useNavigate();

  const [form] = Form.useForm<FormType>();
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
  const { state, contents: post } = useRecoilValueLoadable(postState(params));
  const onRefreshPostState = useRecoilRefresher_UNSTABLE(postState(params));

  const isCreate = useMemo(() => !id && isEmptyObject(post), [id, post]);
  const isSchedule = useMemo(
    () => post?.Status === 'Published' && moment(Number(post?.DatePublish)).isSameOrAfter(moment()),
    [post],
  );

  useEffect(() => {
    if (!isCreate) {
      form.setFieldsValue(useCurrentValues(post));
    }
    setLoading(false);
  }, [form, isCreate, post]);

  const onValidate = useCallback(async (msg) => {
    if (msg === 'VALIDATE_POST_TITLE_EXISTED') {
      setErrorTitle(t('posts:actions.exists.title'));
    }
    if (msg === 'VALIDATE_POST_SLUG_EXISTED') {
      setErrorSlug(t('posts:actions.exists.slug'));
    }
  }, []);

  const onSubmitCreate = useCallback(
    async (values) => {
      const { Status } = values;

      const input: CreatePostType = {
        ...values,
        Type: type,
        Status: Status === 'Draft' ? 'Published' : Status,
      };

      return createPost(input)
        .then((res) => {
          if (res?.createPost?.InsertId) {
            navigate(`/posts/${res.createPost.InsertId}/update`, { replace: true });
            return notificationSuccess(t('posts:actions.create.succeed'));
          }
          return notificationError(t('posts:actions.create.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false));
    },
    [navigate, onValidate, type],
  );

  const onSubmitUpdate = useCallback(
    async (values) => {
      const { Status } = values;

      let status = Status;
      if (Status === 'Draft') {
        if (post?.Status !== 'Draft') status = 'Draft';
        else status = 'Published';
      }

      const input: UpdatePostType = {
        ...values,
        Status: status,
      };

      return updatePost(id, input)
        .then((res) => {
          if (res?.updatePost?.RowsAffected === 1) {
            onRefreshPostState();
            return notificationSuccess(t('posts:actions.update.succeed'));
          }
          return notificationError(t('posts:actions.update.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false));
    },
    [id, onRefreshPostState, onValidate, post?.Status],
  );

  const onSubmitFinish = useCallback(
    async (o) => {
      const values = await useFormValues(o);

      setLoading(true);
      await delayLoading();

      setErrorTitle('');
      setErrorSlug('');

      if (isCreate) {
        return onSubmitCreate(values);
      }
      return onSubmitUpdate(values);
    },
    [isCreate, onSubmitCreate, onSubmitUpdate],
  );

  const onDraftFinish = useCallback(async () => {
    form.validateFields().then(async (o) => {
      const values = await useFormValues(o);

      setLoading(true);
      await delayLoading();

      setErrorTitle('');
      setErrorSlug('');

      const input: CreatePostType = {
        ...values,
        Type: type,
        Status: 'Draft',
      };

      return createPost(input)
        .then((res) => {
          if (res?.createPost?.RowsAffected === 1) {
            navigate('/posts', { replace: true });
            return notificationSuccess(t('posts:actions.create.succeed'));
          }
          return notificationError(t('posts:actions.create.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false));
    });
  }, [form, navigate, onValidate, type]);

  const onTrashFinish = useCallback(async () => {
    setLoading(true);
    await delayLoading();

    setErrorTitle('');
    setErrorSlug('');

    const input: UpdatePostType = {
      Status: 'Trash',
    };

    return updatePost(id, input)
      .then((res) => {
        if (res?.updatePost?.RowsAffected === 1) {
          navigate('/posts', { replace: true });
          return notificationSuccess(t('posts:actions.trash.succeed'));
        }
        return notificationError(t('posts:actions.trash.failed'));
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (id && !post) {
    return <ResultNotFound />;
  }

  return (
    <Spin spinning={state === 'loading' && !isCreate}>
      <PostsSegmented value={segmentedTab} onChange={(value) => setSegmentedTab(value)} />
      <Section />
      <Form form={form} initialValues={initialValues} onFinish={onSubmitFinish}>
        <Row justify="space-between" gutter={40}>
          <Col md={24} xl={17} hidden={segmentedTab !== 'main'}>
            <PostsMain form={form} errorTitle={errorTitle} errorSlug={errorSlug} />
          </Col>
          <Col md={24} xl={17} hidden={segmentedTab !== 'seo'}>
            Content of Tab Pane 2
          </Col>
          <Col md={24} xl={7}>
            <Space size="large" direction="vertical" className="w-100">
              <Collapse defaultActiveKey={['1', '2', '3']}>
                <Collapse.Panel key="1" header={t('posts:form.collapse.post')}>
                  <PostsPost
                    loading={loading}
                    isCreate={isCreate}
                    isSchedule={isSchedule}
                    onDraftFinish={onDraftFinish}
                    onTrashFinish={onTrashFinish}
                  />
                </Collapse.Panel>
              </Collapse>
              {type === 'Post' && (
                <Collapse defaultActiveKey={['1', '2', '3']}>
                  <Collapse.Panel key="2" header={t('posts:form.collapse.taxonomy')}>
                    <PostsTaxonomy post={post} />
                  </Collapse.Panel>
                </Collapse>
              )}
              <Collapse defaultActiveKey={['1', '2', '3']}>
                <Collapse.Panel key="3" header={t('posts:form.collapse.image')}>
                  {/* <FormItem name="Avatar" label={t('posts:form.input.avatar')}>
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
