import PageNotFound from '@common/Pages/PageNotFound';
import { getCommonData } from '@core/next';
import { GetStaticProps } from 'next';

export default function NotFoundPage() {
  return <PageNotFound />;
}

export const getStaticProps: GetStaticProps = async (context) => ({
  props: { ...(await getCommonData(context)) },
});
