import { MOVIE_INFO } from '@const/path';
import { MovieType } from '@const/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {
  value: MovieType;
  showBigImage?: boolean;
  noSidebar?: boolean;
};

export default function FilmsSliderItem(props: Props) {
  const { value, showBigImage, noSidebar } = props;

  return (
    <div
      className={`pm-main-film-item
      ${showBigImage ? ' large' : ''}${noSidebar ? ' no-sidebar' : ''}`}
    >
      <Link href={`/${MOVIE_INFO}/${value?.movie_slug}`}>
        <a title={value?.movie_title}>
          <Image
            src={value?.meta?.movie_avatar || ''}
            alt={value?.movie_title}
            layout="fill"
            priority
          />
          <span className="pm-main-film-badge">{value?.meta?.movie_quality}</span>
          <span className="pm-main-film-text">{value?.movie_title}</span>
          <span className="pm-main-film-play" />
        </a>
      </Link>
    </div>
  );
}
