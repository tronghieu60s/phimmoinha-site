import { ApolloProvider } from '@apollo/client';
import '@assets/css/Common.scss';
import '@assets/css/Display.scss';
import '@assets/css/Sizing.scss';
import '@assets/css/Spacing.scss';
import '@assets/css/Text.scss';
import PageLoading from '@common/Pages/PageLoading';
import apolloClient from '@core/apollo';
import '@core/i18n';
import { Suspense } from 'react';
import { hot } from 'react-hot-loader/root';
import 'react-quill/dist/quill.snow.css';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import Router from './Router';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <RecoilRoot>
        <RecoilNexus />
        <Suspense fallback={<PageLoading />}>
          <Router />
        </Suspense>
      </RecoilRoot>
    </ApolloProvider>
  );
}

export default hot(App);
