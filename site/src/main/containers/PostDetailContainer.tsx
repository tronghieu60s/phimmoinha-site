import Breadcrumb from '@common/Base/Breadcrumb';
import { InView } from '@common/Base/IntersectionObserver';
import Section from '@common/Base/Section';
import PostsDetailContent from '@components/Posts/Detail/PostsDetailContent';
import { BreadcrumbType, PostType } from '@const/types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

type Props = {
  post: PostType;
  breadcrumb: BreadcrumbType[];
};

const APP_FACEBOOK_HREF = process.env.NEXT_PUBLIC_APP_FACEBOOK_HREF || '';

const FacebookComment = dynamic(() => import('@common/Base/Facebook/FacebookComment'), {
  suspense: true,
});

export default function PostDetailContainer(props: Props) {
  const { post, breadcrumb } = props;
  const { asPath } = useRouter();
  return (
    <>
      <Section>
        <Breadcrumb items={breadcrumb} />
        <PostsDetailContent post={post} />
      </Section>
      <InView>
        {({ ref }) => (
          <Section ref={ref}>
            <FacebookComment href={`${APP_FACEBOOK_HREF}${asPath}`} />
          </Section>
        )}
      </InView>
    </>
  );
}
