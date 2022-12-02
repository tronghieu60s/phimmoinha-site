import { MovieEpisodeType } from '@const/types';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

type Props = {
  items?: MovieEpisodeType[];
  server?: string;
  selected?: string;
};

export default function FilmsDetailEpisode(props: Props) {
  const { items, server, selected } = props;
  const { t } = useTranslation();
  const { pathname: curPathName, query, route } = useRouter();

  const pathname = useMemo(
    () => (route.indexOf('[ep]') > -1 ? curPathName : `${curPathName}/[ep]`),
    [curPathName, route],
  );

  return (
    <ul className="pm-main-film-info-episode">
      {((!selected && !server) || !server) && (
        <li className="pm-main-film-info-server-item active" aria-hidden="true">
          {t(`common:text.trailer`)}
        </li>
      )}
      {server &&
        items?.map((item) => (
          <li
            key={item._id}
            className={`pm-main-film-info-episode-item${
              item.episode_slug === selected ? ' active' : ''
            }`}
          >
            <Link href={{ pathname, query: { ...query, ep: item.episode_slug } }}>
              <a title={item.episode_name}>{item.episode_name}</a>
            </Link>
          </li>
        ))}
    </ul>
  );
}
