import PostsList from '@containers/Posts/PostsList';
import useQuery from '@hooks/useQuery';
import { PostStatusType } from '@service/post/post.types';
import { Card, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense, useMemo } from 'react';

export default function PagesListPage() {
  const query = useQuery();

  const page = useMemo(() => Number(query.get('page')), [query]);
  const page_size = useMemo(() => Number(query.get('page_size')), [query]);

  const type = 'Page';
  const status = ['Draft', 'Published'] as PostStatusType[];

  return (
    <Suspense fallback={<Skeleton active />}>
      <Card title={t('site:title.posts.list')} bordered={false}>
        <PostsList query={{ page, page_size, type, status }} />
      </Card>
    </Suspense>
  );
}
