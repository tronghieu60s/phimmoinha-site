import { ApolloProvider } from '@apollo/client';
import '@assets/css/styles.scss';
import Head from '@common/Base/Head';
import Layout from '@common/Layout';
import apolloClient from '@core/apollo';
import type { AppProps } from 'next/app';
import 'plyr-react/plyr.css';
import '@assets/css/plyr.scss';
import 'slick-carousel/slick/slick.css';
import '../styles/normalize.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Head {...pageProps} />
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
