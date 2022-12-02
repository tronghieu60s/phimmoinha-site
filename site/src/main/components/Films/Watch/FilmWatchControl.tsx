import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import { AlertTriangle, Bookmark, ChevronsRight, Clock, XCircle } from 'react-feather';

type Props = {
  following?: boolean;
  onWatchNext?: () => void;
  onWatchHistory?: () => void;
  onWatchFollow?: () => void;
  onWatchReport?: () => void;
};

export default function FilmWatchControl(props: Props) {
  const { following, onWatchNext, onWatchHistory, onWatchFollow, onWatchReport } = props;
  const { t } = useTranslation();

  return (
    <div className="pm-main-film-info-control">
      <button
        type="button"
        title={t('film-watch:button.next')}
        className="pm-common-button pm-common-button"
        onClick={onWatchNext}
      >
        <span>{t('film-watch:button.next')}</span>
        <ChevronsRight size={18} className="pm-common-button-icon" />
      </button>
      <button
        type="button"
        title={t('film-watch:button.history')}
        className="pm-common-button pm-common-button-danger"
        onClick={onWatchHistory}
      >
        <span>{t('film-watch:button.history')}</span>
        <Clock size={16} className="pm-common-button-icon" />
      </button>
      <button
        type="button"
        title={t('film-watch:button.follow')}
        className="pm-common-button pm-common-button-success"
        onClick={onWatchFollow}
      >
        <span>{t('film-watch:button.follow')}</span>
        {following ? (
          <XCircle size={16} className="pm-common-button-icon" />
        ) : (
          <Bookmark size={16} className="pm-common-button-icon" />
        )}
      </button>
      <button
        type="button"
        title={t('film-watch:button.report')}
        className="pm-common-button pm-common-button-primary"
        onClick={onWatchReport}
      >
        <span>{t('film-watch:button.report')}</span>
        <AlertTriangle size={16} className="pm-common-button-icon" />
      </button>
    </div>
  );
}
