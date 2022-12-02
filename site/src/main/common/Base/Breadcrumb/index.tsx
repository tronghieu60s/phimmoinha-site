import { BreadcrumbType } from '@const/types';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { Fragment } from 'react';
import { Home } from 'react-feather';

type Props = {
  items: BreadcrumbType[];
};

export default function Breadcrumb(props: Props) {
  const { items } = props;
  const { t } = useTranslation();

  return (
    <div className="pm-main-breadcrumb">
      <Link href="/">
        <a title={t('common:breadcrumb.home')}>
          <Home size={16} className="mt-2" /> {t('common:breadcrumb.home')}
        </a>
      </Link>
      {items?.map((item) => (
        <Fragment key={item.label}>
          <span>/</span>
          <Link href={item.path}>
            <a title={item.label}>{item.label}</a>
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
