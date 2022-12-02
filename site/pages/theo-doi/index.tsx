import { initialPagination } from '@const/initial';
import { FOLLOWED_LIST } from '@const/path';
import { FOLLOWED_STORAGE } from '@const/storage';
import { FOLLOWED } from '@const/text';
import { BreadcrumbType, MovieType, PaginationType } from '@const/types';
import FilmContainer from '@containers/FilmContainer';
import { isBrowser } from '@core/commonFuncs';
import { getCommonData } from '@core/next';
import { getMovies } from '@models/moviesModel';
import { GetStaticProps } from 'next';
import useTranslation from 'next-translate/useTranslation';
import { useCallback, useEffect, useMemo, useState } from 'react';

const APP_PAGINATION_LIST_LIMIT = process.env.NEXT_PUBLIC_APP_PAGINATION_LIST_LIMIT || 10;

export default function Followed() {
  const { t } = useTranslation();
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>(initialPagination);

  const breadcrumb = useMemo(
    (): BreadcrumbType[] => [
      {
        label: t('film-list:breadcrumb.followed'),
        path: `/${FOLLOWED_LIST}`,
      },
    ],
    [t],
  );

  const getFollow = useCallback(async () => {
    const followedStorage = localStorage.getItem(FOLLOWED_STORAGE);
    const followed = followedStorage ? JSON.parse(followedStorage) : [];

    const watchedMovies = await getMovies({
      ids: followed,
      params: {
        pageSize: Number(APP_PAGINATION_LIST_LIMIT),
      },
    });
    setMovies(watchedMovies.getMovies?.data?.items || []);
    setPagination(watchedMovies.getMovies?.data?.pagination || initialPagination);
  }, []);

  useEffect(() => {
    if (isBrowser()) getFollow();
  }, [getFollow]);

  return (
    <FilmContainer
      headingText={t('film-list:breadcrumb.followed')}
      keywordText={t('film-list:keyword.followed')}
      breadcrumb={breadcrumb}
      movies={movies}
      pagination={pagination}
    />
  );
}

export const getStaticProps: GetStaticProps = async (context) => ({
  props: {
    ...(await getCommonData(context, { title: FOLLOWED, sidebar: true })),
  },
});
