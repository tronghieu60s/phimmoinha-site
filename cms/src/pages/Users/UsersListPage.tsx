import UsersList from '@containers/Users/UsersList';
import useQuery from '@hooks/useQuery';
import { Card, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense, useMemo } from 'react';

export default function UsersListPage() {
  const query = useQuery();
  const page = useMemo(() => Number(query.get('page')), [query]);
  const page_size = useMemo(() => Number(query.get('page_size')), [query]);

  return (
    <Suspense fallback={<Skeleton active />}>
      <Card title={t('site:title.users.list')} bordered={false}>
        <UsersList query={{ page, page_size }} />
      </Card>
    </Suspense>
  );
}
