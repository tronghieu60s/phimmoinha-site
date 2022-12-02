import Heading from '@common/Base/Heading';
import HeadingCaption from '@common/Base/Heading/HeadingCaption';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

export default function PageError() {
  const { t } = useTranslation();

  return (
    <div className="pm-main-error">
      <h2 className="pm-main-error-icon">
        <span>5</span>
        <span>0</span>
        <span>0</span>
      </h2>
      <Heading>{t('common:500.title')}</Heading>
      <HeadingCaption>{t('common:500.caption')}</HeadingCaption>
    </div>
  );
}
