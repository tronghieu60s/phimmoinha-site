import { MOVIE_LIST } from '@const/path';
import { MOVIE_TEXT } from '@const/text';
import { BreadcrumbType, MovieType, PaginationType } from '@const/types';
import FilmContainer from '@containers/FilmContainer';
import { getCommonData } from '@core/next';
import { getMovies } from '@models/moviesModel';
import { CommonOptions } from '@models/optionsModel';
import { GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useMemo } from 'react';

type Props = {
  movies: MovieType[];
  pagination: PaginationType;
  options: CommonOptions;
};

const APP_PAGE_REVALIDATE_TIME = process.env.NEXT_PUBLIC_APP_PAGE_REVALIDATE_TIME || 1000;
const APP_PAGINATION_LIST_LIMIT = process.env.NEXT_PUBLIC_APP_PAGINATION_LIST_LIMIT || 10;

export default function Movies(props: Props) {
  const { options } = props;
  const { movies, pagination } = props;
  const { t } = useTranslation();

  const breadcrumb = useMemo(
    (): BreadcrumbType[] => [
      {
        label: t('film-list:breadcrumb.movie'),
        path: `/${MOVIE_LIST}`,
      },
    ],
    [t],
  );

  const keywordText = options?.keywordsConfig?.data?.option_value?.movie;

  return (
    <FilmContainer
      headingText={t('film-list:heading.movie')}
      keywordText={t('', { year: new Date().getFullYear() }, { default: keywordText })}
      breadcrumb={breadcrumb}
      movies={movies}
      pagination={pagination}
    />
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const moviesItem = await getMovies({
    params: {
      search: { movie_type: 'movie' },
      pageSize: Number(APP_PAGINATION_LIST_LIMIT),
    },
  });
  const movies = moviesItem?.getMovies?.data?.items;
  const pagination = moviesItem?.getMovies?.data?.pagination;

  return {
    props: {
      ...(await getCommonData(context, {
        title: MOVIE_TEXT,
        sidebar: true,
      })),
      movies,
      pagination,
    },
    revalidate: Number(APP_PAGE_REVALIDATE_TIME),
  };
};
