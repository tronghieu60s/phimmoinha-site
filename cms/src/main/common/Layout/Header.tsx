import { accessUserState, authState } from '@service/auth/auth.reducer';
import { SignInType } from '@service/auth/auth.types';
import { Avatar, Col, Dropdown, Menu, Row, Space, Typography } from 'antd';
import { Header as DefaultHeader } from 'antd/lib/layout/layout';
import { t } from 'i18next';
import md5 from 'md5';
import { useCallback, useMemo } from 'react';
import { LogOut } from 'react-feather';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export default function Header() {
  const setAuth = useSetRecoilState(authState);
  const accessUser = useRecoilValue(accessUserState);

  const onLogout = useCallback(() => setAuth({} as SignInType), [setAuth]);

  const menu = useMemo(
    () => (
      <Menu
        items={[
          {
            key: '1',
            label: t('auth:actions.logout'),
            icon: <LogOut size={15} />,
            onClick: onLogout,
          },
        ]}
      />
    ),
    [onLogout],
  );

  const avatar = useMemo(() => {
    const email = accessUser?.Email || '';
    return `https://www.gravatar.com/avatar/${md5(email)}?d=identicon&s=100`;
  }, [accessUser?.Email]);

  return (
    <DefaultHeader>
      <Row justify="end" className="px-4">
        {/* <Col>
          {maintain && (
            <Space>
              <Badge status="warning" />
              {t('common:alert.maintain')}
            </Space>
          )}
        </Col> */}
        <Col>
          <Dropdown overlay={menu}>
            <Space align="center">
              <Avatar size={30} shape="square" icon={<img src={avatar} alt="Film Avatar" />} />
              <Typography.Text strong style={{ display: 'block', marginTop: 5 }}>
                {accessUser.FullName || accessUser.UserName}
              </Typography.Text>
            </Space>
          </Dropdown>
        </Col>
      </Row>
    </DefaultHeader>
  );
}
