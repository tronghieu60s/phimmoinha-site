import PageError from '@common/Pages/PageError';
import { getCommonData } from '@core/next';
import { GetStaticProps } from 'next';

export default function ErrorPage() {
  return <PageError />;
}

export const getStaticProps: GetStaticProps = async (context) => ({
  props: { ...(await getCommonData(context)) },
});
