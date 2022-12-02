import { COUNTRY_LIST, PAGE } from '@const/path';
import { PAGE_TEXT } from '@const/text';
import { BreadcrumbType, MovieType, PaginationType, TermType } from '@const/types';
import FilmContainer from '@containers/FilmContainer';
import { getCommonData } from '@core/next';
import { getMovies } from '@models/moviesModel';
import { CommonOptions } from '@models/optionsModel';
import { getTerm, getTerms } from '@models/termsModel';
import { GetStaticPaths, GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useMemo } from 'react';

type Props = {
  term: TermType;
  movies: MovieType[];
  pagination: PaginationType;
  options: CommonOptions;
};

const APP_PAGE_REVALIDATE_TIME = process.env.NEXT_PUBLIC_APP_PAGE_REVALIDATE_TIME || 1000;
const APP_PAGINATION_LIST_LIMIT = process.env.NEXT_PUBLIC_APP_PAGINATION_LIST_LIMIT || 10;

export default function CountriesSlugPage(props: Props) {
  const { options } = props;
  const { term, movies, pagination } = props;
  const { t } = useTranslation();

  const breadcrumb = useMemo(
    (): BreadcrumbType[] => [
      {
        label: t('film-list:breadcrumb.country'),
        path: `/${COUNTRY_LIST}`,
      },
      {
        label: `${term?.term_name}`,
        path: `/${COUNTRY_LIST}/${term?.term_slug}`,
      },
    ],
    [t, term?.term_name, term?.term_slug],
  );

  const keywordText = options?.keywordsConfig?.data?.option_value?.country;

  return (
    <FilmContainer
      headingText={`${term?.term_name}`}
      keywordText={t(
        '',
        { value: term?.term_name, year: new Date().getFullYear() },
        { default: keywordText },
      )}
      breadcrumb={breadcrumb}
      movies={movies}
      pagination={pagination}
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const termsItem = await getTerms({
    params: {
      search: { term_taxonomy: 'movie_country' },
      loadAll: true,
    },
  });
  const terms = termsItem?.getTerms?.data?.items;
  const paths =
    terms?.map((item) => ({
      params: { slug: item?.term_slug, page: `${PAGE}-1` },
    })) || [];

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params = {} } = context;
  const { slug, page: curPage } = params;

  const page = Number(String(curPage).replace(`${PAGE}-`, '')) || 1;

  const termItem = await getTerm({
    params: {
      term_slug: String(slug),
      term_taxonomy: 'movie_country',
    },
  });
  const term = termItem?.getTerm?.data;

  if (!term) {
    return { notFound: true };
  }

  const moviesItem = await getMovies({
    params: {
      search: { terms: { $in: [term._id] } },
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
        title: `${term?.term_name} - ${PAGE_TEXT} ${page}`,
        sidebar: true,
      })),
      term,
      movies,
      pagination,
    },
    revalidate: Number(APP_PAGE_REVALIDATE_TIME),
  };
};
