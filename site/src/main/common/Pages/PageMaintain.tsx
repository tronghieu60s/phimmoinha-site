import Heading from '@common/Base/Heading';
import HeadingCaption from '@common/Base/Heading/HeadingCaption';
import useTranslation from 'next-translate/useTranslation';

export default function PageMaintain() {
  const { t } = useTranslation();

  return (
    <div className="pm-main-error">
      <h2 className="pm-main-error-icon">
        <span>5</span>
        <span>0</span>
        <span>3</span>
      </h2>
      <Heading>{t('common:maintain.title')}</Heading>
      <HeadingCaption>{t('common:maintain.caption')}</HeadingCaption>
    </div>
  );
}
