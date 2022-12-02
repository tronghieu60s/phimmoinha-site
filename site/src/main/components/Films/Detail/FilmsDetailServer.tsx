import { MovieEpisodeType, ServerWatchType } from '@const/types';
import { mapObjectToArray } from '@core/commonFuncs';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';

type Props = {
  items?: MovieEpisodeType['episode_server'];
  selected?: string;
  onSelect?: (server: ServerWatchType) => void;
};

export default function FilmsDetailServer(props: Props) {
  const { items, selected, onSelect } = props;
  const { t } = useTranslation();

  return (
    <ul className="pm-main-film-info-server">
      {mapObjectToArray(items || {})
        .filter((item) => item.value)
        .sort((a, b) => a.key.length - b.key.length)
        .map((item, index) => {
          const name = item.key.split('_').pop() || '';
          return (
            <li
              key={name}
              className={`pm-main-film-info-server-item${selected === name ? ' active' : ''}`}
              onClick={() => onSelect?.(name)}
              aria-hidden="true"
            >
              #{index + 1} {t(`film-watch:server.${name}`)}
            </li>
          );
        })}
    </ul>
  );
}
