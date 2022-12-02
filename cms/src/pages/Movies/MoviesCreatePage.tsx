import MoviesForm from '@containers/Movies/MoviesForm';
import { Card, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense } from 'react';

export default function MoviesCreatePage() {
  return (
    <Suspense fallback={<Skeleton active />}>
      <Card title={t('site:title.movies.create')} bordered={false}>
        <MoviesForm />
      </Card>
    </Suspense>
  );
}
