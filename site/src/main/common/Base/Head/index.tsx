import { CommonOptions } from '@models/optionsModel';
import DefaultHead from 'next/head';
import { useRouter } from 'next/router';

type Props = {
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  image?: string;
  keywords?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  options: CommonOptions;
};

const APP_SITE_URL = process.env.NEXT_PUBLIC_APP_SITE_URL || 'https://localhost';

export default function Head(props: Props) {
  const {
    type = 'website',
    title,
    description,
    image,
    keywords,
    robotsIndex = true,
    robotsFollow = true,
    options,
  } = props;
  const router = useRouter();

  const dfTitle = options?.siteConfig?.data?.option_value?.title;
  const seoTitle = options?.siteConfig?.data?.option_value?.seo_title;
  const seoDescription = options?.siteConfig?.data?.option_value?.seo_description;
  const seoKeywords = options?.siteConfig?.data?.option_value?.seo_keywords;
  const seoKeywordsName = seoKeywords
    ?.map((item: string) => JSON.parse(item)?.term_name)
    .join(', ');

  const siteTitle = `${title || seoTitle || 'Error'} | ${dfTitle || 'PhimMoiNha'}`;
  const currentUrl = `${APP_SITE_URL}${router.asPath}`;

  const contentRobots = `${robotsIndex ? 'index' : 'noindex'}, ${
    robotsFollow ? 'follow' : 'nofollow'
  }`;

  return (
    <DefaultHead>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />

      {/* Meta SEO */}
      <title>{siteTitle}</title>
      <meta name="google" content="notranslate" />
      <meta name="robots" content={contentRobots} />
      <meta name="googlebot" content={contentRobots} />
      <meta name="keywords" content={keywords || seoKeywordsName} />
      <meta name="description" content={description || seoDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Meta Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || seoDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="vi_VN" />
      {/* <meta property="og:image:width" content="1200" /> */}
      {/* <meta property="og:image:height" content="630" /> */}

      {/* Meta Twitter */}
      <meta name="twitter:card" content="summary" />
      {/* <meta name="twitter:site" content="@site_account" /> */}
      {/* <meta name="twitter:creator" content="@individual_account" /> */}
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description || seoDescription} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={currentUrl} />

      {/* Theme & Icons */}
      <meta name="theme-color" content="#121212" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#121212" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
    </DefaultHead>
  );
}
