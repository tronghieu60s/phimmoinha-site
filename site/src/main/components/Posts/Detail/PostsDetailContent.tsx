import { PostType } from '@const/types';
import React from 'react';

type Props = {
  post: PostType;
};

export default function PostsDetailContent(props: Props) {
  const { post } = props;

  return (
    <div
      className="pm-main-post-info-content"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: String(post?.post_content) }}
    />
  );
}
