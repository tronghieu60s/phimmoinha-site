import Form from '@common/Base/Form/Form';
import { FormInputText, FormInputTextarea } from '@common/Base/Form/FormInput';
import FormItem from '@common/Base/Form/FormItem';
import ResultNotFound from '@common/Base/Result/ResultNotFound';
import Section from '@common/Base/UI/Section';
import { delayLoading, isEmptyObject } from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { permissionsState } from '@service/permission/permission.reducer';
import { PermissionType } from '@service/permission/permission.types';
import { createRole, updateRole } from '@service/role/role.model';
import { forceRefreshRolesState, roleIdState, roleSelectedState } from '@service/role/role.reducer';
import { Button, Checkbox, Col, Row, Space, Spin } from 'antd';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilValueLoadable,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { FormType, initialValues, useCurrentValues } from './RolesHooks';

export default function RolesForm() {
  const [form] = Form.useForm<FormType>();
  const [loading, setLoading] = useState(false);
  const [, forceRender] = useState({});

  const [errorName, setErrorName] = useState('');

  const { contents: id } = useRecoilValueLoadable(roleIdState);
  const onResetRoleId = useResetRecoilState(roleIdState);
  const { state, contents: role } = useRecoilValueLoadable(roleSelectedState);
  const onRoleRefresh = useRecoilRefresher_UNSTABLE(roleSelectedState);
  const onForceRefreshRoles = useSetRecoilState(forceRefreshRolesState);
  const { contents: permissions } = useRecoilValueLoadable(
    permissionsState({ pagination: { All: true } }),
  );

  const isCreate = useMemo(() => !id && isEmptyObject(role), [role, id]);

  useEffect(() => {
    if (!id) {
      form.resetFields();
    }
  }, [form, id]);

  useEffect(() => {
    if (!isCreate) {
      form.setFieldsValue(useCurrentValues(role));
      forceRender({});
    }
  }, [form, isCreate, role]);

  const onValidate = useCallback(async (msg) => {
    if (msg === 'VALIDATE_ROLE_NAME_EXISTED') {
      setErrorName(t('roles:actions.exists.name'));
    }
  }, []);

  const onSubmitCreate = useCallback(
    async (values) =>
      createRole(values)
        .then((res) => {
          if (res?.createRole?.InsertId) {
            form.resetFields();
            onForceRefreshRoles({});
            return notificationSuccess(t('roles:actions.create.succeed'));
          }
          return notificationError(t('roles:actions.create.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false)),
    [form, onForceRefreshRoles, onValidate],
  );

  const onSubmitUpdate = useCallback(
    async (values) =>
      updateRole(id, values)
        .then((res) => {
          if (res?.updateRole?.RowsAffected === 1) {
            onRoleRefresh();
            onForceRefreshRoles({});
            return notificationSuccess(t('roles:actions.update.succeed'));
          }
          return notificationError(t('roles:actions.update.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false)),
    [id, onForceRefreshRoles, onRoleRefresh, onValidate],
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

  if (id && !role) {
    return <ResultNotFound />;
  }

  return (
    <Form form={form} initialValues={initialValues} onFinish={onSubmitFinish}>
      <Spin spinning={state === 'loading' && !isCreate}>
        <Row justify="start" gutter={40}>
          <Col span={24}>
            <FormItem
              name="Name"
              label={t('roles:form.input.name')}
              rules={[{ required: true, max: 60, whitespace: true }]}
              {...(errorName && {
                hasFeedback: true,
                help: errorName,
                validateStatus: 'warning',
              })}
            >
              <FormInputText />
            </FormItem>
            <FormItem name="Description" label={t('roles:form.input.description')}>
              <FormInputTextarea />
            </FormItem>
            <FormItem name="Permissions" label={t('roles:form.input.permissions')}>
              <Checkbox.Group
                value={form.getFieldValue('Permissions')}
                options={
                  permissions?.Items?.map((o: PermissionType) => ({
                    value: o.Id,
                    label: o.Name,
                  })) || []
                }
              />
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
                  <Button type="primary" danger onClick={onResetRoleId}>
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
