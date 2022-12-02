import logoDark from '@assets/images/logo-dark.png';
import logoLight from '@assets/images/logo-light.png';
import useMenu from '@const/menu';
import { themeState } from '@service/theme/theme.reducer';
import { Layout, Menu } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

const { APP_DOCUMENT_TITLE } = process.env;

export default function Sider() {
  const router = useMenu();
  const navigate = useNavigate();
  const location = useLocation();
  const [, selected, ...subSelected] = location.pathname.split('/');

  const theme = useRecoilValue(themeState);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(
    () => window.addEventListener('resize', () => setCollapsed(window.innerWidth <= 768)),
    [],
  );

  const renderMenu = useCallback(
    () =>
      router.map((o) => {
        const MenuIcon = o.icon || AlertTriangle;
        const MenuGroup = o.children ? Menu.SubMenu : Menu.Item;
        return (
          <MenuGroup
            key={o.key}
            icon={<MenuIcon size={18} />}
            title={o.title}
            onClick={
              !o.children
                ? () => navigate(o.path ? `${o.path}${o.query || ''}` : `/${o.key}${o.query || ''}`)
                : () => {}
            }
            hidden={o.hidden}
          >
            {o.children
              ? o.children.map((o2) => (
                  // eslint-disable-next-line react/jsx-indent
                  <Menu.Item
                    key={`${o.key}-${o2.key}`}
                    onClick={() =>
                      navigate(
                        o2.path
                          ? `${o2.path}${o2.query || ''}`
                          : `/${o.key}/${o2.key}${o2.query || ''}`,
                      )
                    }
                    hidden={o2.hidden}
                  >
                    {o2.title}
                  </Menu.Item>
                  // eslint-disable-next-line indent
                ))
              : o.title}
          </MenuGroup>
        );
      }),
    [navigate, router],
  );

  const themeLogo = useMemo(() => (theme === 'light' ? logoLight : logoDark), [theme]);

  return (
    <Layout.Sider
      theme={theme}
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
    >
      <h1 className="Logo">
        <img src={themeLogo} alt={APP_DOCUMENT_TITLE} />
      </h1>
      <Menu
        // theme={theme}
        mode="vertical"
        className="sider-menu"
        defaultSelectedKeys={[
          selected || 'dashboard',
          `${selected}-${subSelected[subSelected.length - 1]}`,
        ]}
      >
        {renderMenu()}
      </Menu>
    </Layout.Sider>
  );
}
