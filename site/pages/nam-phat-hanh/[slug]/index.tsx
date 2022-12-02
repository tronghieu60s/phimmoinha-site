import { PUBLISH_LIST } from '@const/path';
import { PUBLISH_TEXT } from '@const/text';
import { BreadcrumbType, MovieType, PaginationType } from '@const/types';
import FilmContainer from '@containers/FilmContainer';
import { getCommonData } from '@core/next';
import { getMovies } from '@models/moviesModel';
import { CommonOptions } from '@models/optionsModel';
import { GetStaticPaths, GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useMemo } from 'react';

type Props = {
  slug: string;
  movies: MovieType[];
  pagination: PaginationType;
  options: CommonOptions;
};

const APP_PAGE_REVALIDATE_TIME = process.env.NEXT_PUBLIC_APP_PAGE_REVALIDATE_TIME || 1000;
const APP_PAGINATION_LIST_LIMIT = process.env.NEXT_PUBLIC_APP_PAGINATION_LIST_LIMIT || 10;

const PUBLISH_DATA = [...Array.from(Array(2500).keys()).slice(2007, new Date().getFullYear() + 1)];

export default function PublishSlug(props: Props) {
  const { options } = props;
  const { slug, movies, pagination } = props;
  const { t } = useTranslation();

  const breadcrumb = useMemo(
    (): BreadcrumbType[] => [
      {
        label: t('film-list:breadcrumb.publish'),
        path: `/${PUBLISH_LIST}`,
      },
      {
        label: `${t('film-list:breadcrumb.year')} ${slug}`,
        path: `/${PUBLISH_LIST}/${slug}`,
      },
    ],
    [slug, t],
  );

  const keywordText = options?.keywordsConfig?.data?.option_value?.publish;

  return (
    <FilmContainer
      headingText={`${t('film-list:heading.publish')} ${slug}`}
      keywordText={t('', { value: slug }, { default: keywordText })}
      breadcrumb={breadcrumb}
      movies={movies}
      pagination={pagination}
    />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = PUBLISH_DATA?.map((item) => ({ params: { slug: `${item}` } })) || [];
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params = {} } = context;
  const { slug } = params;

  if (!PUBLISH_DATA.includes(Number(slug))) {
    return { notFound: true };
  }

  const moviesItem = await getMovies({
    params: {
      search: { 'meta.movie_publish': Number(slug) },
      pageSize: Number(APP_PAGINATION_LIST_LIMIT),
    },
  });
  const movies = moviesItem?.getMovies?.data?.items;
  const pagination = moviesItem?.getMovies?.data?.pagination;

  return {
    props: {
      ...(await getCommonData(context, {
        title: `${PUBLISH_TEXT} ${slug}`,
        sidebar: true,
      })),
      slug,
      movies,
      pagination,
    },
    revalidate: Number(APP_PAGE_REVALIDATE_TIME),
  };
};
