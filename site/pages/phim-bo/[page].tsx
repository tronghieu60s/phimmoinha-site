import { MOVIE_SERIES, PAGE } from '@const/path';
import { PAGE_TEXT, SERIES_TEXT } from '@const/text';
import { BreadcrumbType, MovieType, PaginationType } from '@const/types';
import FilmContainer from '@containers/FilmContainer';
import { getCommonData } from '@core/next';
import { getMovies } from '@models/moviesModel';
import { CommonOptions } from '@models/optionsModel';
import { GetStaticPaths, GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useMemo } from 'react';

type Props = {
  movies: MovieType[];
  pagination: PaginationType;
  options: CommonOptions;
};

const APP_PAGE_REVALIDATE_TIME = process.env.NEXT_PUBLIC_APP_PAGE_REVALIDATE_TIME || 1000;
const APP_PAGINATION_LIST_LIMIT = process.env.NEXT_PUBLIC_APP_PAGINATION_LIST_LIMIT || 10;

export default function SeriesPage(props: Props) {
  const { options } = props;
  const { movies, pagination } = props;
  const { t } = useTranslation();

  const breadcrumb = useMemo(
    (): BreadcrumbType[] => [
      {
        label: t('film-list:breadcrumb.series'),
        path: `/${MOVIE_SERIES}`,
      },
    ],
    [t],
  );

  const keywordText = options?.keywordsConfig?.data?.option_value?.series;

  return (
    <FilmContainer
      headingText={t('film-list:heading.series')}
      keywordText={t('', { year: new Date().getFullYear() }, { default: keywordText })}
      breadcrumb={breadcrumb}
      movies={movies}
      pagination={pagination}
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [{ params: { page: `${PAGE}-1` } }];
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params = {} } = context;
  const { page: curPage } = params;

  const page = Number(String(curPage).replace(`${PAGE}-`, '')) || 1;

  const moviesItem = await getMovies({
    params: {
      search: { movie_type: 'series' },
      page: Number(page) || 1,
      pageSize: Number(APP_PAGINATION_LIST_LIMIT),
    },
  });
  const movies = moviesItem?.getMovies?.data?.items;
  const totalPage = moviesItem?.getMovies?.data?.pagination?.pageTotal || 1;
  const pagination = moviesItem?.getMovies?.data?.pagination;

  if (Number(page) > totalPage) {
    return { notFound: true };
  }

  return {
    props: {
      ...(await getCommonData(context, {
        title: `${SERIES_TEXT} - ${PAGE_TEXT} ${page}`,
        sidebar: true,
      })),
      movies,
      pagination,
    },
    revalidate: Number(APP_PAGE_REVALIDATE_TIME),
  };
};
