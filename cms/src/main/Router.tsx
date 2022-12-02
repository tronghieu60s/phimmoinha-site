import PageLoading from '@common/Pages/PageLoading';
import useSite from '@const/site';
import AuthLogin from '@containers/Auth/AuthLogin';
import { isEmptyObject } from '@core/commonFuncs';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { authServiceState, authState, authStateAtom } from '@service/auth/auth.reducer';
import { SignInType } from '@service/auth/auth.types';
import socketClientState from '@service/socket/socket.reducer';
import { siteColorState, siteDirectionState } from '@service/theme/theme.reducer';
import { ConfigProvider } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { io } from 'socket.io-client';
import Layout from './common/Layout';
import PageNotFound from './common/Pages/PageNotFound';

const APP_API_SOCKET_URL = process.env.APP_API_SOCKET_URL || 'http://localhost:4000';

const socket = io(APP_API_SOCKET_URL);

export default function Router() {
  const router = useSite();
  const [loading, setLoading] = useState(true);

  const setAuth = useSetRecoilState(authState);
  const authValueState = useRecoilValue(authStateAtom);

  const siteColor = useRecoilValue(siteColorState);
  const siteDirection = useRecoilValue(siteDirectionState);

  useEffect(() => {
    socket.on('pong', () => setLoading(false));

    socket.on('connect', async () => {
      const fp = await FingerprintJS.load();
      const fpResult = await fp.get();
      setRecoil(authServiceState, fpResult);

      const pingData = {
        Section_Id: authValueState?.AccessToken || null,
        Service_Id: fpResult.visitorId,
      };
      socket.emit('ping', pingData);

      setRecoil(socketClientState, socket);
    });

    socket.on('logout', () => {
      setAuth({} as SignInType);
      setLoading(false);
    });

    return () => {
      socket.off('pong');
      socket.off('connect');
      socket.off('logout');
    };
  }, [authValueState?.AccessToken, setAuth]);

  useEffect(() => ConfigProvider.config({ theme: siteColor }), [siteColor]);

  const renderRouter = useCallback(() => {
    const result: {
      key: string;
      path: string;
      element?: React.ComponentType<any>;
    }[] = [];
    router.forEach((o) => {
      result.push({
        key: o.key,
        path: o.path || `/${o.key}`,
        element: o.element,
      });
      o.children?.forEach((o2) => {
        result.push({
          key: `${o.key}-${o2.key}`,
          path: o2.path ? `/${o.key}${o2.path}` : `/${o.key}/${o2.key}`,
          element: o2.element,
        });
      });
    });
    return result.map((o) => {
      const Element = o.element || PageNotFound;
      return <Route key={o.key} path={o.path} element={<Element />} />;
    });
  }, [router]);

  if (loading) return <PageLoading />;

  if (!authValueState || isEmptyObject(authValueState)) {
    return <AuthLogin />;
  }

  return (
    <ConfigProvider direction={siteDirection}>
      <BrowserRouter>
        <Layout>
          <Routes>
            {renderRouter()}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
}
