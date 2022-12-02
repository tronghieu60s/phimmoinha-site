import { TAG_LIST } from '@const/path';
import { TermType } from '@const/types';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import React from 'react';

type Props = {
  items: TermType[];
};

export default function FilmsDetailTags(props: Props) {
  const { items } = props;
  const { t } = useTranslation();

  return (
    <ul className="pm-main-film-info-tag">
      {items.map((tag) => (
        <li key={tag._id} className="pm-main-film-info-tag-item">
          <Link href={`/${TAG_LIST}/${tag?.term_slug}`}>
            <a title={`${t('film-watch:info.tag')} ${tag?.term_name}`}>{tag?.term_name}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
