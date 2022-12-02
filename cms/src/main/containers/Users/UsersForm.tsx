import Form from '@common/Base/Form/Form';
import { FormInputPassword, FormInputText } from '@common/Base/Form/FormInput';
import FormItem from '@common/Base/Form/FormItem';
import ResultNotFound from '@common/Base/Result/ResultNotFound';
import { delayLoading, isEmptyObject, randomString } from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { rolesState } from '@service/role/role.reducer';
import { RoleType } from '@service/role/role.types';
import { createUser, updateUser } from '@service/user/user.model';
import { userState } from '@service/user/user.reducer';
import { Avatar, Button, Checkbox, Col, Row, Select, Space, Spin } from 'antd';
import { t } from 'i18next';
import md5 from 'md5';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { FormType, initialValues, useCurrentValues } from './UsersHooks';

type Props = {
  id?: string;
};

export default function UsersForm(props: Props) {
  const { id: uid } = props;
  const id = Number(uid) || 0;
  const navigate = useNavigate();

  const [form] = Form.useForm<FormType>();
  const [loading, setLoading] = useState(false);
  const [, forceRender] = useState({});

  const [avatarUrl, setAvatarUrl] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const [errorEmail, setErrorEmail] = useState('');

  const { state, contents: user } = useRecoilValueLoadable(userState(id));
  const onUserRefresh = useRecoilRefresher_UNSTABLE(userState(id));
  const { contents: roles } = useRecoilValueLoadable(rolesState({ pagination: { All: true } }));

  const isCreate = useMemo(() => !id && isEmptyObject(user), [id, user]);

  useEffect(() => {
    if (!isCreate) {
      form.setFieldsValue(useCurrentValues(user));
      forceRender({});
    }
  }, [form, isCreate, user]);

  useEffect(() => {
    if (roles && !form.getFieldValue('Role')) {
      form.setFieldsValue({ Role_Ref: roles?.Items?.[0].Id });
    }
  }, [form, roles]);

  const onChangeEmail = useCallback(() => {
    const Email = form.getFieldValue('Email') || user?.Email || randomString(10);
    setAvatarUrl(`https://www.gravatar.com/avatar/${md5(Email)}?d=identicon&s=100`);
  }, [user, form]);

  const onGeneratePassword = useCallback(
    () => form.setFieldsValue({ Password: randomString(20) }),
    [form],
  );

  useEffect(() => {
    onChangeEmail();
    onGeneratePassword();
  }, [onChangeEmail, onGeneratePassword]);

  const onValidate = useCallback(async (msg) => {
    if (msg === 'VALIDATE_USER_EMAIL_EXISTED') {
      setErrorEmail(t('users:actions.exists.email'));
    }
    if (msg === 'VALIDATE_USER_USERNAME_EXISTED') {
      setErrorLogin(t('users:actions.exists.login'));
    }
  }, []);

  const onSubmitCreate = useCallback(
    async (values) =>
      createUser(values)
        .then((res) => {
          if (res?.createUser?.InsertId) {
            navigate(`/users/${res.createUser.InsertId}/update`, { replace: true });
            return notificationSuccess(t('users:actions.create.succeed'));
          }
          return notificationError(t('users:actions.create.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false)),
    [navigate, onValidate],
  );

  const onSubmitUpdate = useCallback(
    async (values) =>
      updateUser(id, values)
        .then((res) => {
          if (res?.updateUser?.RowsAffected === 1) {
            onUserRefresh();
            return notificationSuccess(t('users:actions.update.succeed'));
          }
          return notificationError(t('users:actions.update.failed'));
        })
        .catch(onValidate)
        .finally(() => setLoading(false)),
    [id, onUserRefresh, onValidate],
  );

  const onSubmitFinish = useCallback(
    async (values) => {
      setLoading(true);
      await delayLoading();

      setErrorLogin('');
      setErrorEmail('');

      if (isCreate) {
        return onSubmitCreate(values);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { UserName, Email, ...restValues } = values;
      return onSubmitUpdate(restValues);
    },
    [isCreate, onSubmitCreate, onSubmitUpdate],
  );

  if (id && !user) {
    return <ResultNotFound />;
  }

  return (
    <Form form={form} initialValues={initialValues} onFinish={onSubmitFinish}>
      <Spin spinning={state === 'loading' && !isCreate}>
        <Row justify="start" className="px-2" gutter={40}>
          <Col span={8} className="mb-4">
            <Space direction="vertical">
              <Avatar size={80} shape="square" src={avatarUrl} />
              <a href="https://en.gravatar.com/" className="py-1" target="_blank" rel="noreferrer">
                {t('users:form.input.avatar')}
              </a>
              <FormItem name="IsAdministrator" valuePropName="checked" className="mb-0">
                <Checkbox>{t('users:form.input.administrator')}</Checkbox>
              </FormItem>
              {!isCreate && (
                <Button
                  type="dashed"
                  className="text-capitalize"
                  onClick={onGeneratePassword}
                  hidden={isCreate}
                >
                  {t('common:button.resend.pass')}
                </Button>
              )}
            </Space>
          </Col>
          <Col span={16}>
            <Row justify="start" gutter={40}>
              <Col span={8}>
                <FormItem
                  name="UserName"
                  label={t('users:form.input.login')}
                  rules={[
                    { required: true, max: 60, whitespace: true },
                    { pattern: /^[a-zA-Z0-9]+$/, message: t('users:actions.validate.login') },
                  ]}
                  {...(errorLogin && {
                    hasFeedback: true,
                    help: errorLogin,
                    validateStatus: 'warning',
                  })}
                >
                  <FormInputText disabled={!isCreate} />
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  name="Email"
                  label={t('users:form.input.email')}
                  rules={[{ type: 'email', required: true, max: 100, whitespace: true }]}
                  {...(errorEmail && {
                    hasFeedback: true,
                    help: errorEmail,
                    validateStatus: 'warning',
                  })}
                >
                  <FormInputText disabled={!isCreate} onChange={onChangeEmail} />
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  name="Role_Ref"
                  label={t('users:form.input.role')}
                  rules={[{ required: true }]}
                >
                  <Select>
                    {roles?.Items?.map((o: RoleType) => (
                      <Select.Option key={o.Id} value={o.Id}>
                        {o.Name}
                      </Select.Option>
                    ))}
                  </Select>
                </FormItem>
              </Col>
              {isCreate && (
                <Col span={8}>
                  <FormItem
                    name="Password"
                    label={t('users:form.input.password')}
                    rules={[{ required: true, max: 100, whitespace: true }]}
                    className="mb-2"
                  >
                    <FormInputPassword />
                  </FormItem>
                  <Button type="dashed" className="text-capitalize" onClick={onGeneratePassword}>
                    {t('common:button.create.pass')}
                  </Button>
                </Col>
              )}
              <Col span={8}>
                <FormItem
                  name="FirstName"
                  label={t('users:form.input.first.name')}
                  rules={[{ max: 100, whitespace: true }]}
                >
                  <FormInputText />
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  name="LastName"
                  label={t('users:form.input.last.name')}
                  rules={[{ max: 100, whitespace: true }]}
                >
                  <FormInputText />
                </FormItem>
              </Col>
              {!isCreate && (
                <Col span={8}>
                  <FormItem
                    name="FullName"
                    label={t('users:form.input.full.name')}
                    rules={[{ required: true, max: 100, whitespace: true }]}
                  >
                    <FormInputText />
                  </FormItem>
                </Col>
              )}
            </Row>
          </Col>
          <Col span={24}>
            <Button loading={loading} type="primary" htmlType="submit">
              {t('common:actions.save')}
            </Button>
          </Col>
        </Row>
      </Spin>
    </Form>
  );
}
