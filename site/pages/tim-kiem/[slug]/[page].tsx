import { PAGE, SEARCH_LIST } from '@const/path';
import { SEARCH_TEXT } from '@const/text';
import { BreadcrumbType, MovieType, PaginationType } from '@const/types';
import FilmContainer from '@containers/FilmContainer';
import { getCommonData } from '@core/next';
import { getMovies } from '@models/moviesModel';
import { CommonOptions } from '@models/optionsModel';
import { GetServerSideProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import React, { useMemo } from 'react';

type Props = {
  slug: string;
  movies: MovieType[];
  pagination: PaginationType;
  options: CommonOptions;
};

const APP_PAGINATION_LIST_LIMIT = process.env.NEXT_PUBLIC_APP_PAGINATION_LIST_LIMIT || 10;

export default function SearchSlugPage(props: Props) {
  const { options } = props;
  const { slug, movies, pagination } = props;
  const { t } = useTranslation();

  const breadcrumb = useMemo(
    (): BreadcrumbType[] => [
      {
        label: t('film-list:breadcrumb.search'),
        path: `/${SEARCH_LIST}`,
      },
      {
        label: `${slug}`,
        path: `/${SEARCH_LIST}/${slug}`,
      },
    ],
    [slug, t],
  );

  const keywordText = options?.keywordsConfig?.data?.option_value?.tag;

  return (
    <FilmContainer
      headingText={`${t('film-list:heading.tag')}: ${slug}`}
      keywordText={t('', { value: slug, year: new Date().getFullYear() }, { default: keywordText })}
      breadcrumb={breadcrumb}
      movies={movies}
      pagination={pagination}
    />
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params = {} } = context;
  const { slug, page: curPage } = params;

  const page = Number(String(curPage).replace(`${PAGE}-`, '')) || 1;

  const moviesItem = await getMovies({
    params: {
      search: {
        $or: [
          { movie_title: { $regex: slug, $options: 'i' } },
          { 'meta.movie_original': { $regex: slug, $options: 'i' } },
          { movie_content: { $regex: slug, $options: 'i' } },
        ],
      },
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
        title: `${SEARCH_TEXT}: ${slug}`,
        sidebar: true,
        robotsIndex: false,
      })),
      slug,
      movies,
      pagination,
    },
  };
};
