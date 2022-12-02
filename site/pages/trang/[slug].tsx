import { PAGE_INFO } from '@const/path';
import { BreadcrumbType, PostType } from '@const/types';
import PostDetailContainer from '@containers/PostDetailContainer';
import { getCommonData } from '@core/next';
import { getPost, getPosts } from '@models/postsModel';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useMemo } from 'react';

type Props = {
  page: PostType;
};

const APP_PAGE_REVALIDATE_TIME = process.env.NEXT_PUBLIC_APP_PAGE_REVALIDATE_TIME || 1000;

export default function PageSlug(props: Props) {
  const { page } = props;

  const breadcrumb = useMemo(
    (): BreadcrumbType[] => [
      {
        label: `${page.post_title}`,
        path: `/${PAGE_INFO}/${page.post_title}`,
      },
    ],
    [page.post_title],
  );

  return <PostDetailContainer post={page} breadcrumb={breadcrumb} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pagesItem = await getPosts({ params: { search: { post_type: 'page' } } });
  const pages = pagesItem?.getPosts?.data?.items;
  const paths = pages?.map((page) => ({ params: { slug: page.post_slug } })) || [];

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params = {} } = context;
  const { slug } = params;

  const pageItem = await getPost({ params: { post_slug: String(slug), post_type: 'page' } });
  const page = pageItem?.getPost?.data;

  if (!page) {
    return { notFound: true };
  }

  return {
    props: {
      ...(await getCommonData(context, {
        type: 'article',
        title: page?.post_title,
        description: page?.post_excerpt,
        image: page?.meta?.post_avatar,
        sidebar: false,
        robotsIndex: false,
      })),
      page,
    },
    revalidate: Number(APP_PAGE_REVALIDATE_TIME),
  };
};
