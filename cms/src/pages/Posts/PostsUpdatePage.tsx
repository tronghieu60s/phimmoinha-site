import PostsForm from '@containers/Posts/PostsForm';
import { PostMetaType } from '@service/post/post.types';
import { Card, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';

export default function PostsUpdatePage() {
  const { id } = useParams();

  const type: PostMetaType = 'Post';

  return (
    <Suspense fallback={<Skeleton active />}>
      <Card title={t('site:title.posts.update')} bordered={false}>
        <PostsForm id={id} query={{ type }} />
      </Card>
    </Suspense>
  );
}
