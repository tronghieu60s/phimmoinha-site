import MoviesForm from '@containers/Movies/MoviesForm';
import { Card, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

export default function MoviesUpdatePage() {
  const { id } = useParams();

  return (
    <Suspense fallback={<Skeleton active />}>
      <Card title={t('site:title.movies.update')} bordered={false}>
        <MoviesForm id={id} />
      </Card>
    </Suspense>
  );
}
