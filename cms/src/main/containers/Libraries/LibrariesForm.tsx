import Form from '@common/Base/Form/Form';
import { FormInputColor, FormInputText, FormInputTextarea } from '@common/Base/Form/FormInput';
import FormItem from '@common/Base/Form/FormItem';
import ResultNotFound from '@common/Base/Result/ResultNotFound';
import Section from '@common/Base/UI/Section';
import { PresetColor } from '@const/color';
import { delayLoading, isEmptyObject } from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { createLibrary, updateLibrary } from '@service/library/library.model';
import {
  forceRefreshLibrariesState,
  libraryIdState,
  librarySelectedState,
} from '@service/library/library.reducer';
import { Button, Col, Row, Select, Space, Spin } from 'antd';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { FormType, initialValues, useCurrentValues, useFormValues } from './LibrariesHooks';

export default function LibrariesForm() {
  const [form] = Form.useForm<FormType>();
  const [, forceRender] = useState({});
  const [loading, setLoading] = useState(false);

  const [errorKey, setErrorKey] = useState('');

  const { contents: id } = useRecoilValueLoadable(libraryIdState);
  const onResetLibraryId = useResetRecoilState(libraryIdState);
  const { state, contents: library } = useRecoilValueLoadable(librarySelectedState);
  const onLibraryRefresh = useRecoilRefresher_UNSTABLE(librarySelectedState);
  const onForceRefreshLibraries = useSetRecoilState(forceRefreshLibrariesState);

  const isCreate = useMemo(() => !id && isEmptyObject(library), [library, id]);

  useEffect(() => {
    if (!id) {
      form.resetFields();
    }
  }, [form, id]);

  useEffect(() => {
    if (!isCreate) {
      form.setFieldsValue(useCurrentValues(library));
      forceRender({});
    }
  }, [form, isCreate, library]);

  const onValidate = useCallback(async (msg) => {
    if (msg === 'VALIDATE_LIBRARY_KEY_EXISTED') {
      setErrorKey(t('libraries:actions.exists.key'));
    }
  }, []);

  const onSubmitCreate = useCallback(
    async (values) =>
      createLibrary(values)
        .then((res) => {
          if (res?.createLibrary?.InsertId) {
            form.resetFields();
            onForceRefreshLibraries({});
            return notificationSuccess(t('libraries:actions.create.succeed'));
          }
          return notificationError(t('libraries:actions.create.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false)),
    [form, onForceRefreshLibraries, onValidate],
  );

  const onSubmitUpdate = useCallback(
    async (values) =>
      updateLibrary(id, values)
        .then((res) => {
          if (res?.updateLibrary?.RowsAffected === 1) {
            onLibraryRefresh();
            onForceRefreshLibraries({});
            return notificationSuccess(t('libraries:actions.update.succeed'));
          }
          return notificationError(t('libraries:actions.update.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false)),
    [id, onForceRefreshLibraries, onLibraryRefresh, onValidate],
  );

  const onSubmitFinish = useCallback(
    async (o) => {
      const values = await useFormValues(o);

      setLoading(true);
      await delayLoading();

      setErrorKey('');

      if (isCreate) {
        return onSubmitCreate(values);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Type, ...restValues } = values;
      return onSubmitUpdate(restValues);
    },
    [isCreate, onSubmitCreate, onSubmitUpdate],
  );

  if (id && !library) {
    return <ResultNotFound />;
  }

  return (
    <Form form={form} initialValues={initialValues} onFinish={onSubmitFinish}>
      <Spin spinning={state === 'loading' && !isCreate}>
        <Row justify="start" gutter={40}>
          <Col span={24}>
            <FormItem
              name="Type"
              label={t('libraries:form.input.type')}
              rules={[{ required: true, max: 60, whitespace: true }]}
            >
              <FormInputText disabled={!isCreate} />
            </FormItem>
            <FormItem
              name="Key"
              label={t('libraries:form.input.key')}
              rules={[{ required: true, max: 60, whitespace: true }]}
              {...(errorKey && {
                hasFeedback: true,
                help: errorKey,
                validateStatus: 'warning',
              })}
            >
              <FormInputText />
            </FormItem>
            <FormItem name="Value" label={t('libraries:form.input.value')}>
              <FormInputTextarea />
            </FormItem>
            <Space align="end">
              <FormItem name="Color" label={t('libraries:form.input.color')}>
                <Select
                  showArrow
                  options={PresetColor.map((color) => ({ label: color, value: color }))}
                />
              </FormItem>
              <FormItem name="ColorHex" style={{ width: 100 }}>
                <FormInputColor onChange={(e) => form.setFieldsValue({ Color: e.target.value })} />
              </FormItem>
            </Space>
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
                  <Button type="primary" danger onClick={onResetLibraryId}>
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
