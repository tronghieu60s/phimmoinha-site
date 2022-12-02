import { FormInputPassword, FormInputText } from '@common/Base/Form/FormInput';
import FormItem from '@common/Base/Form/FormItem';
import Footer from '@common/Layout/Footer';
import { delayLoading } from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { useValidateMessages } from '@hooks/useTableHooks';
import { signIn, signUp } from '@service/auth/auth.model';
import { authServiceState, authState } from '@service/auth/auth.reducer';
import { Button, Card, Checkbox, Form, Layout as RootLayout, Space, Typography } from 'antd';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { Key, Mail, User } from 'react-feather';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const APP_JWT_TOKEN_EXPIRES_IN = process.env.APP_JWT_TOKEN_EXPIRES_IN || 86400000;
const APP_JWT_TOKEN_EXPIRES_IN_LONG = process.env.APP_JWT_TOKEN_EXPIRES_IN_LONG || 86400000;

type FormType = {
  Login: string;
  Email: string;
  Password: string;
  RePassword: string;
  RememberMe: boolean;
};

export const initialValues: FormType = {
  Login: '',
  Email: '',
  Password: '',
  RePassword: '',
  RememberMe: false,
};

export default function AuthLogin() {
  const [type, setType] = useState('login');
  const [loading, setLoading] = useState(false);

  const setAuth = useSetRecoilState(authState);
  const authService = useRecoilValue(authServiceState);

  const [form] = Form.useForm();

  const onSignIn = useCallback(
    async (values: FormType) => {
      const { Login, Password, RememberMe } = values;

      const logged = await signIn({
        Login,
        Password,
        Expires: Number(RememberMe ? APP_JWT_TOKEN_EXPIRES_IN_LONG : APP_JWT_TOKEN_EXPIRES_IN),
        Service_Id: authService.visitorId,
      }).finally(() => {
        setLoading(false);
      });

      if (logged?.signIn?.Data) {
        setAuth(logged.signIn.Data);
        notificationSuccess(t('auth:actions.login.succeed'));
      }
    },
    [authService, setAuth],
  );

  const onSignUp = useCallback(async (values: FormType) => {
    const { Login, Email, Password, RePassword } = values;

    if (Password !== RePassword) {
      setLoading(false);
      notificationError(t('errors:ERROR_SIGN_UP_PASSWORD'));
      return;
    }

    const registered = await signUp({
      UserName: Login,
      Email,
      Password,
    }).finally(() => {
      setLoading(false);
    });

    if (registered?.signUp?.InsertId) {
      setType('login');
      notificationSuccess(t('auth:actions.register.succeed'));
    }
  }, []);

  const onSubmitFinish = useCallback(
    async (values: FormType) => {
      if (!authService) {
        return;
      }

      setLoading(true);
      await delayLoading();

      if (type === 'login') {
        await onSignIn(values);
      }

      if (type === 'register') {
        await onSignUp(values);
      }

      if (type === 'forgot') {
        setLoading(false);
        // await onForgot(values);
      }
    },
    [authService, onSignIn, onSignUp, type],
  );

  return (
    <RootLayout className="Layout">
      <RootLayout className="Layout-Main">
        <RootLayout.Content className="Layout-Auth">
          <Card className="Layout-Auth-Card">
            <Form
              form={form}
              name="basic"
              autoComplete="off"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={initialValues}
              validateMessages={useValidateMessages()}
              onFinish={onSubmitFinish}
            >
              {(type === 'login' || type === 'register') && (
                <FormItem
                  name="Login"
                  rules={[
                    {
                      required: true,
                      ...(type === 'register' ? { min: 6, max: 60, whitespace: true } : {}),
                    },
                    { pattern: /^[a-zA-Z0-9]+$/, message: t('users:actions.validate.login') },
                  ]}
                >
                  <FormInputText
                    size="large"
                    placeholder={t('auth:form.input.login.placeholder')}
                    prefix={<User size={15} color="rgba(0,0,0,.25)" />}
                  />
                </FormItem>
              )}
              {(type === 'forgot' || type === 'register') && (
                <FormItem name="Email" rules={[{ type: 'email', required: true }]}>
                  <FormInputText
                    size="large"
                    placeholder={t('auth:form.input.email.placeholder')}
                    prefix={<Mail size={15} color="rgba(0,0,0,.25)" />}
                  />
                </FormItem>
              )}
              {(type === 'login' || type === 'register') && (
                <FormItem name="Password" rules={[{ required: true }]}>
                  <FormInputPassword
                    size="large"
                    placeholder={t('auth:form.input.pass.placeholder')}
                    prefix={<Key size={15} color="rgba(0,0,0,.25)" />}
                  />
                </FormItem>
              )}
              {type === 'register' && (
                <FormItem name="RePassword" rules={[{ required: true }]}>
                  <FormInputPassword
                    size="large"
                    placeholder={t('auth:form.input.repass.placeholder')}
                    prefix={<Key size={15} color="rgba(0,0,0,.25)" />}
                  />
                </FormItem>
              )}
              {type === 'login' && (
                <FormItem name="RememberMe" valuePropName="checked" className="mb-2">
                  <Checkbox>{t('auth:form.input.remember.placeholder')}</Checkbox>
                </FormItem>
              )}
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                  {type === 'login' && t('auth:actions.login')}
                  {type === 'register' && t('auth:actions.register')}
                  {type === 'forgot' && t('auth:actions.forgot')}
                </Button>
                {type === 'login' && (
                  <Space>
                    <Typography.Link onClick={() => setType('register')}>
                      {t('auth:actions.register.text')}
                    </Typography.Link>
                    {' | '}
                    <Typography.Link onClick={() => setType('forgot')}>
                      {t('auth:actions.forgot.text')}
                    </Typography.Link>
                  </Space>
                )}
                {(type === 'forgot' || type === 'register') && (
                  <Typography.Text>
                    {t('auth:actions.login.text.1')}
                    <Typography.Link onClick={() => setType('login')} className="ml-1">
                      {t('auth:actions.login.text.2')}
                    </Typography.Link>
                  </Typography.Text>
                )}
              </Space>
            </Form>
          </Card>
        </RootLayout.Content>
        <Footer />
      </RootLayout>
    </RootLayout>
  );
}
