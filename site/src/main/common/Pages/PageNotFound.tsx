import Heading from '@common/Base/Heading';
import HeadingCaption from '@common/Base/Heading/HeadingCaption';
import { InView } from '@common/Base/IntersectionObserver';
import FilmsDetailSuggestion from '@components/Films/Detail/FilmsDetailSuggestion';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

export default function PageNotFound() {
  const { t } = useTranslation();

  return (
    <div className="pm-main-error">
      <h2 className="pm-main-error-icon">
        <span>4</span>
        <img src="/logo512.png" alt="404 Not Found" />
        <span>4</span>
      </h2>
      <Heading>{t('common:404.title')}</Heading>
      <HeadingCaption>{t('common:404.caption')}</HeadingCaption>
      <InView>{({ ref }) => <FilmsDetailSuggestion ref={ref} />}</InView>
    </div>
  );
}
