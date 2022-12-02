import PostsList from '@containers/Posts/PostsList';
import useQuery from '@hooks/useQuery';
import { Card, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense, useMemo } from 'react';

export default function PostsTrashPage() {
  const query = useQuery();

  const page = useMemo(() => Number(query.get('page')), [query]);
  const page_size = useMemo(() => Number(query.get('page_size')), [query]);

  const type = 'Post';
  const status = 'Trash';

  return (
    <Suspense fallback={<Skeleton active />}>
      <Card title={t('site:title.posts.list')} bordered={false}>
        <PostsList query={{ page, page_size, type, status }} />
      </Card>
    </Suspense>
  );
}
