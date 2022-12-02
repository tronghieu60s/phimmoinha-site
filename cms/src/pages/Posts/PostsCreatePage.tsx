import PostsForm from '@containers/Posts/PostsForm';
import { Card, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense } from 'react';

export default function PostsCreatePage() {
  const type = 'Post';

  return (
    <Suspense fallback={<Skeleton active />}>
      <Card title={t('site:title.posts.create')} bordered={false}>
        <PostsForm query={{ type }} />
      </Card>
    </Suspense>
  );
}
