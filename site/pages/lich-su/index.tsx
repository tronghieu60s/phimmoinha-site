import { initialPagination } from '@const/initial';
import { HISTORY_LIST } from '@const/path';
import { WATCHED_STORAGE } from '@const/storage';
import { HISTORY } from '@const/text';
import { BreadcrumbType, MovieType, PaginationType } from '@const/types';
import FilmContainer from '@containers/FilmContainer';
import { isBrowser } from '@core/commonFuncs';
import { getCommonData } from '@core/next';
import { getMovies } from '@models/moviesModel';
import { GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useCallback, useEffect, useMemo, useState } from 'react';

const APP_PAGINATION_LIST_LIMIT = process.env.NEXT_PUBLIC_APP_PAGINATION_LIST_LIMIT || 10;

export default function History() {
  const { t } = useTranslation();
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>(initialPagination);

  const breadcrumb = useMemo(
    (): BreadcrumbType[] => [
      {
        label: t('film-list:breadcrumb.history'),
        path: `/${HISTORY_LIST}`,
      },
    ],
    [t],
  );

  const getHistory = useCallback(async () => {
    const watchedStorage = localStorage.getItem(WATCHED_STORAGE);
    const watched = watchedStorage ? JSON.parse(watchedStorage) : [];

    const watchedMovies = await getMovies({
      ids: watched,
      params: {
        pageSize: Number(APP_PAGINATION_LIST_LIMIT),
      },
    });
    setMovies(watchedMovies.getMovies?.data?.items || []);
    setPagination(watchedMovies.getMovies?.data?.pagination || initialPagination);
  }, []);

  useEffect(() => {
    if (isBrowser()) getHistory();
  }, [getHistory]);

  return (
    <FilmContainer
      headingText={t('film-list:breadcrumb.history')}
      keywordText={t('film-list:keyword.history')}
      breadcrumb={breadcrumb}
      movies={movies}
      pagination={pagination}
    />
  );
}

export const getStaticProps: GetStaticProps = async (context) => ({
  props: {
    ...(await getCommonData(context, { title: HISTORY, sidebar: true })),
  },
});
