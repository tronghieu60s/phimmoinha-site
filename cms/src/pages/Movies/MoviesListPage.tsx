import MoviesList from '@containers/Movies/MoviesList';
import useQuery from '@hooks/useQuery';
import { MovieStatusType } from '@service/movie/movie.types';
import { Card, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense, useMemo } from 'react';

export default function MoviesListPage() {
  const query = useQuery();

  const page = useMemo(() => Number(query.get('page')), [query]);
  const page_size = useMemo(() => Number(query.get('page_size')), [query]);

  const status = ['Draft', 'Published'] as MovieStatusType[];

  return (
    <Suspense fallback={<Skeleton active />}>
      <Card title={t('site:title.movies.list')} bordered={false}>
        <MoviesList query={{ page, page_size, status }} />
      </Card>
    </Suspense>
  );
}
