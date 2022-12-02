import Form from '@common/Base/Form/Form';
import { FormInputEditor, FormInputText } from '@common/Base/Form/FormInput';
import FormItem from '@common/Base/Form/FormItem';
import ResultNotFound from '@common/Base/Result/ResultNotFound';
import Section from '@common/Base/UI/Section';
import { delayLoading, isEmptyObject, isValidSlug } from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { createTaxonomy, updateTaxonomy } from '@service/taxonomy/taxonomy.model';
import {
  forceRefreshTaxonomiesState,
  taxonomyIdState,
  taxonomySelectedState,
} from '@service/taxonomy/taxonomy.reducer';
import { TaxonomyMetaType } from '@service/taxonomy/taxonomy.types';
import { Button, Col, Row, Space, Spin } from 'antd';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { FormType, initialValues } from './TaxonomiesHooks';

type Props = {
  query: {
    type: TaxonomyMetaType;
  };
};

export default function TaxonomiesForm(props: Props) {
  const {
    query: { type },
  } = props;

  const [form] = Form.useForm<FormType>();
  const [loading, setLoading] = useState(false);
  const [, forceRender] = useState({});

  const [errorName, setErrorName] = useState('');
  const [errorSlug, setErrorSlug] = useState('');

  const { contents: id } = useRecoilValueLoadable(taxonomyIdState);
  const onResetTaxonomyId = useResetRecoilState(taxonomyIdState);
  const { state, contents: taxonomy } = useRecoilValueLoadable(taxonomySelectedState);
  const onTaxonomiesRefresh = useRecoilRefresher_UNSTABLE(taxonomySelectedState);
  const onForceRefreshTaxonomies = useSetRecoilState(forceRefreshTaxonomiesState);

  const isCreate = useMemo(() => !id && isEmptyObject(taxonomy), [taxonomy, id]);

  useEffect(() => {
    if (!id) {
      form.resetFields();
    }
  }, [form, id]);

  useEffect(() => {
    if (type) {
      onResetTaxonomyId();
    }
  }, [onResetTaxonomyId, type]);

  useEffect(() => {
    if (type && !isCreate) {
      form.setFieldsValue(taxonomy);
      forceRender({});
    }
  }, [form, isCreate, taxonomy, type]);

  const onValidate = useCallback(async (msg) => {
    if (msg === 'VALIDATE_TAXONOMY_NAME_EXISTED') {
      setErrorName(t('taxonomies:actions.exists.name'));
    }
    if (msg === 'VALIDATE_TAXONOMY_SLUG_EXISTED') {
      setErrorSlug(t('taxonomies:actions.exists.slug'));
    }
  }, []);

  const onSubmitCreate = useCallback(
    async (values) =>
      createTaxonomy(values)
        .then((res) => {
          if (res?.createTaxonomy?.InsertId) {
            form.resetFields();
            onForceRefreshTaxonomies({});
            return notificationSuccess(
              t(`taxonomies:actions.create.${type.toLowerCase()}.succeed`),
            );
          }
          return notificationError(t(`taxonomies:actions.create.${type.toLowerCase()}.failed`));
        })
        .catch(onValidate)
        .finally(() => setLoading(false)),
    [form, onForceRefreshTaxonomies, onValidate, type],
  );

  const onSubmitUpdate = useCallback(
    async (values) =>
      updateTaxonomy(id, values)
        .then((res) => {
          if (res?.updateTaxonomy?.RowsAffected === 1) {
            onTaxonomiesRefresh();
            onForceRefreshTaxonomies({});
            return notificationSuccess(
              t(`taxonomies:actions.update.${type.toLowerCase()}.succeed`),
            );
          }
          return notificationError(t(`taxonomies:actions.update.${type.toLowerCase()}.failed`));
        })
        .catch(onValidate)
        .finally(() => setLoading(false)),
    [id, onForceRefreshTaxonomies, onTaxonomiesRefresh, onValidate, type],
  );

  const onSubmitFinish = useCallback(
    async (values) => {
      const { Slug } = values;

      setLoading(true);
      await delayLoading();

      setErrorName('');
      setErrorSlug('');

      if (Slug && !isValidSlug(Slug.trim())) {
        setErrorSlug(t('taxonomies:actions.invalid.slug'));
        return setLoading(false);
      }

      if (isCreate) {
        return onSubmitCreate({ Type: type, ...values });
      }
      return onSubmitUpdate(values);
    },
    [isCreate, onSubmitCreate, onSubmitUpdate, type],
  );

  if (id && !type) {
    return <ResultNotFound />;
  }

  return (
    <Form form={form} initialValues={initialValues} onFinish={onSubmitFinish}>
      <Spin spinning={state === 'loading' && !isCreate}>
        <Row justify="start" gutter={40}>
          <Col span={24}>
            <FormItem
              name="Name"
              label={t('taxonomies:form.input.name')}
              rules={[{ required: true, max: 100, whitespace: true }]}
              {...(errorName && {
                hasFeedback: true,
                help: errorName,
                validateStatus: 'warning',
              })}
            >
              <FormInputText />
            </FormItem>
            <FormItem
              name="Slug"
              label={t('taxonomies:form.input.slug')}
              rules={[{ max: 100, whitespace: true }]}
              {...(errorSlug && {
                hasFeedback: true,
                help: errorSlug,
                validateStatus: 'warning',
              })}
            >
              <FormInputText />
            </FormItem>
            <FormItem name="Description" label={t('taxonomies:form.input.description')}>
              <FormInputEditor />
            </FormItem>
          </Col>
          <Col span={24}>
            <Section size="small" />
            <Space>
              {isCreate ? (
                <Button loading={loading} type="primary" htmlType="submit">
                  {t('common:actions.save')}
                </Button>
              ) : (
                <>
                  <Button loading={loading} type="primary" htmlType="submit">
                    {t('common:actions.update')}
                  </Button>
                  <Button type="primary" danger onClick={onResetTaxonomyId}>
                    {t('common:actions.cancel')}
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Spin>
    </Form>
  );
}
