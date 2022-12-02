import Form from '@common/Base/Form/Form';
import { FormInputText, FormInputTextarea } from '@common/Base/Form/FormInput';
import FormItem from '@common/Base/Form/FormItem';
import ResultNotFound from '@common/Base/Result/ResultNotFound';
import Section from '@common/Base/UI/Section';
import { delayLoading, isEmptyObject } from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { createPermission, updatePermission } from '@service/permission/permission.model';
import {
  forceRefreshPermissionsState,
  permissionIdState,
  permissionSelectedState,
} from '@service/permission/permission.reducer';
import { Button, Col, Row, Space, Spin } from 'antd';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { FormType, initialValues } from './PermissionsHooks';

export default function PermissionsForm() {
  const [form] = Form.useForm<FormType>();
  const [loading, setLoading] = useState(false);
  const [, forceRender] = useState({});

  const [errorName, setErrorName] = useState('');

  const { contents: id } = useRecoilValueLoadable(permissionIdState);
  const onResetPermissionId = useResetRecoilState(permissionIdState);
  const { state, contents: permission } = useRecoilValueLoadable(permissionSelectedState);
  const onPermissionRefresh = useRecoilRefresher_UNSTABLE(permissionSelectedState);
  const onForceRefreshPermissions = useSetRecoilState(forceRefreshPermissionsState);

  const isCreate = useMemo(() => !id && isEmptyObject(permission), [permission, id]);

  useEffect(() => {
    if (!id) {
      form.resetFields();
    }
  }, [form, id]);

  useEffect(() => {
    if (!isCreate) {
      form.setFieldsValue(permission);
      forceRender({});
    }
  }, [form, isCreate, permission]);

  const onValidate = useCallback(async (msg) => {
    if (msg === 'VALIDATE_PERMISSION_NAME_EXISTED') {
      setErrorName(t('permissions:actions.exists.name'));
    }
  }, []);

  const onSubmitCreate = useCallback(
    async (values) =>
      createPermission(values)
        .then((res) => {
          if (res?.createPermission?.InsertId) {
            form.resetFields();
            onForceRefreshPermissions({});
            return notificationSuccess(t('permissions:actions.create.succeed'));
          }
          return notificationError(t('permissions:actions.create.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false)),
    [form, onForceRefreshPermissions, onValidate],
  );

  const onSubmitUpdate = useCallback(
    async (values) =>
      updatePermission(id, values)
        .then((res) => {
          if (res?.updatePermission?.RowsAffected === 1) {
            onPermissionRefresh();
            onForceRefreshPermissions({});
            return notificationSuccess(t('permissions:actions.update.succeed'));
          }
          return notificationError(t('permissions:actions.update.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false)),
    [id, onForceRefreshPermissions, onPermissionRefresh, onValidate],
  );

  const onSubmitFinish = useCallback(
    async (values) => {
      setLoading(true);
      await delayLoading();

      setErrorName('');

      if (isCreate) {
        return onSubmitCreate(values);
      }
      return onSubmitUpdate(values);
    },
    [isCreate, onSubmitCreate, onSubmitUpdate],
  );

  if (id && !permission) {
    return <ResultNotFound />;
  }

  return (
    <Form form={form} initialValues={initialValues} onFinish={onSubmitFinish}>
      <Spin spinning={state === 'loading' && !isCreate}>
        <Row justify="start" gutter={40}>
          <Col span={24}>
            <FormItem
              name="Name"
              label={t('permissions:form.input.name')}
              rules={[{ required: true, max: 60, whitespace: true }]}
              {...(errorName && {
                hasFeedback: true,
                help: errorName,
                validateStatus: 'warning',
              })}
            >
              <FormInputText />
            </FormItem>
            <FormItem name="Description" label={t('permissions:form.input.description')}>
              <FormInputTextarea />
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
                  <Button type="primary" danger onClick={onResetPermissionId}>
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
