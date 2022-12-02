import Tags from '@common/Base/Tags';
import PageMaintain from '@common/Pages/PageMaintain';
import { CommonOptions } from '@models/optionsModel';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

type Props = {
  title?: string;
  sidebar?: boolean;
  options: CommonOptions;
  children: React.ReactNode;
};

export default function Layout(props: Props) {
  const { sidebar = false, options, children } = props;

  const title = options?.siteConfig?.data?.option_value?.title;

  const logoHeader = options?.headerConfig?.data?.option_value?.logo;
  const menuHeader = options?.headerConfig?.data?.option_value?.menu;
  const logoFooter = options?.footerConfig?.data?.option_value?.logo;
  const menuFooter = options?.footerConfig?.data?.option_value?.menu;
  const copyrightFooter = options?.footerConfig?.data?.option_value?.copyright;
  const newMoviesUpdate = options?.newMoviesUpdate?.data?.items || [];

  const tags = options?.siteConfig?.data?.option_value?.seo_keywords;
  const seoTags = tags?.map((item: string) => JSON.parse(item));
  const keywords = options?.keywordsConfig?.data?.option_value?.main;
  const keywordsTags = keywords?.map((item: string) => JSON.parse(item));

  const isMaintainMode = options?.siteConfig?.data?.option_value?.maintain ?? true;

  return (
    <div className="pm-wrapper">
      <Header logo={logoHeader} menu={menuHeader} title={title} />
      <main className="pm-main">
        <div className="pm-container">
          {isMaintainMode && <PageMaintain />}
          {!isMaintainMode && sidebar && (
            <div className="pm-main-wrapper">
              <div className="pm-main-content">{children}</div>
              <Sidebar tags={seoTags} movies={newMoviesUpdate} />
            </div>
          )}
          {!isMaintainMode && !sidebar && children}
        </div>
        <div className="pm-container">
          <Tags items={keywordsTags} />
        </div>
      </main>
      <Footer logo={logoFooter} menu={menuFooter} copyright={copyrightFooter} title={title} />
      <Toaster position="top-center" />
    </div>
  );
}
