import UsersForm from '@containers/Users/UsersForm';
import { Card, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

export default function UsersUpdatePage() {
  const { id } = useParams();

  return (
    <Suspense fallback={<Skeleton active />}>
      <Card title={t('site:title.users.update')} bordered={false}>
        <UsersForm id={id} />
      </Card>
    </Suspense>
  );
}
