import HomeContainer from '@containers/HomeContainer';
import { getCommonData } from '@core/next';
import { getHomeData, HomeData } from '@models/homeModel';
import { CommonOptions } from '@models/optionsModel';
import { GetStaticProps } from 'next';

type Props = {
  data: HomeData;
  options: CommonOptions;
};

const APP_PAGE_REVALIDATE_TIME = process.env.NEXT_PUBLIC_APP_PAGE_REVALIDATE_TIME || 1000;

export default function Home(props: Props) {
  const { data, options } = props;

  const films = options?.headerConfig?.data?.option_value?.films;
  const filmsSuggestions = films?.map((item: string) => JSON.parse(item));
  const filmsMovie = data?.filmsMovie?.data?.items || [];
  const filmsSeries = data?.filmsSeries?.data?.items || [];
  const filmsUpcoming = data?.filmsUpcoming?.data?.items || [];

  return (
    <HomeContainer
      filmsMovie={filmsMovie}
      filmsSeries={filmsSeries}
      filmsSuggestions={filmsSuggestions}
      filmsUpcoming={filmsUpcoming}
    />
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const data = await getHomeData();

  return {
    props: { ...(await getCommonData(context)), data },
    revalidate: Number(APP_PAGE_REVALIDATE_TIME),
  };
};
