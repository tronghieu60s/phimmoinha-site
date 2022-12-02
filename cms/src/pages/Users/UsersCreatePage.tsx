import UsersForm from '@containers/Users/UsersForm';
import { Card, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense } from 'react';

export default function UsersCreatePage() {
  return (
    <Suspense fallback={<Skeleton active />}>
      <Card title={t('site:title.users.create')} bordered={false}>
        <UsersForm />
      </Card>
    </Suspense>
  );
}
