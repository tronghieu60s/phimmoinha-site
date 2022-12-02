import '@assets/css/Layout.scss';
import ResultError from '@common/Base/Result/ResultError';
import useMenu from '@const/menu';
import { capitalize } from '@core/commonFuncs';
import { Avatar, BackTop, Layout as DefaultLayout } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, ArrowUp, Home } from 'react-feather';
import { useLocation } from 'react-router-dom';
import Bread from './Bread';
import Footer from './Footer';
import Header from './Header';
import Sider from './Sider';

const APP_DOCUMENT_TITLE = process.env.APP_DOCUMENT_TITLE || 'PMN CMS';

type Props = {
  children?: React.ReactNode;
};

export default function Layout(props: Props) {
  const { children } = props;

  const menu = useMenu();
  const location = useLocation();
  const [breadcrumb, setBreadcrumb] = useState<{ title: React.ReactNode; path: string }[]>([]);

  useEffect(() => {
    const arrPath = location.pathname.split('/');
    arrPath.shift();
    const arrBreadcrumb = [
      {
        title: (
          <div className="d-inline-flex align-center">
            <Home size={16} className="mr-1" />
            {t('site:title.home')}
          </div>
        ),
        path: '/',
      },
    ];

    let menuItem = null;
    if (arrPath[0]) {
      menuItem = menu.find((item) => item.key === arrPath[0]);
      const Icon = menuItem?.icon || AlertTriangle;
      arrBreadcrumb.push({
        title: (
          <div className="d-inline-flex align-center">
            <Icon size={16} className="mr-1" />
            {capitalize(menuItem?.title || '#')}
          </div>
        ),
        path: menuItem?.path || `/${menuItem?.key}`,
      });
      if (arrPath.length - 1 > 0) {
        menuItem = menuItem?.children?.find((item) => item.key === arrPath[arrPath.length - 1]);
        arrBreadcrumb.push({
          title: (
            <div className="d-inline-flex align-center">{capitalize(menuItem?.title || '#')}</div>
          ),
          path: menuItem?.path
            ? `/${menuItem?.key}${menuItem?.path}`
            : `/${menuItem?.key}/${menuItem?.key}`,
        });
      }
    }
    document.title = `${APP_DOCUMENT_TITLE}${
      menuItem?.title ? ` | ${capitalize(menuItem?.title)}` : ''
    }`;
    setBreadcrumb(arrBreadcrumb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <DefaultLayout className="Layout">
      <Sider />
      <DefaultLayout className="Layout-Main">
        <Header />
        <DefaultLayout.Content className="Layout-Content">
          <Bread breadcrumb={breadcrumb} />
          <BackTop>
            <Avatar size={40} icon={<ArrowUp size={20} />} className="center" />
          </BackTop>
          <ErrorBoundary FallbackComponent={ResultError} resetKeys={[location]}>
            {children}
          </ErrorBoundary>
        </DefaultLayout.Content>
        <Footer />
      </DefaultLayout>
    </DefaultLayout>
  );
}
