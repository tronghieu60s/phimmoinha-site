import YoutubeEmbed from '@common/Base/Youtube/YoutubeEmbed';
import { ServerWatchType } from '@const/types';
import { getMoviePlayerFbo } from '@models/moviesModel';
import { useEffect, useRef, useState } from 'react';
import PlyrPlayer from '@common/Base/Plyr';
import useTranslation from 'next-translate/useTranslation';

type Props = {
  type?: ServerWatchType;
  title?: string;
  player?: string;
  trailer?: string;
};

export default function FilmWatchIframe(props: Props) {
  const { type, title, player, trailer } = props;
  const { t } = useTranslation();
  const plyrRef = useRef(null);
  const [sourcePath, setSourcePath] = useState('');
  const [isSourceNew, setIsSourceNew] = useState(false);

  useEffect(() => {
    if (!player) return;

    (async () => {
      if (type === 'fbo') {
        const video = await getMoviePlayerFbo({ source_id: player });
        setSourcePath(video.getMoviePlayerFbo?.data || '');
      }
    })();
  }, [player, type]);

  useEffect(() => {
    if (!player) return;
    if (!plyrRef.current) return;
    if (!sourcePath && isSourceNew) return;

    (async () => {
      if (!(plyrRef.current as any)?.plyr.source) {
        const video = await getMoviePlayerFbo({ source_id: player, source_new: true });
        setIsSourceNew(true);
        setSourcePath(video.getMoviePlayerFbo?.data || '');
      }
    })();
  }, [isSourceNew, player, sourcePath]);

  if (!type || !player) {
    return <YoutubeEmbed id={trailer || 'gQlMMD8auMs'} height="100%" />;
  }

  return (
    <>
      {player && (
        <div className="pm-main-film-info-frame-box" hidden={type !== 'hydrax'}>
          <iframe
            title={title}
            width="100%"
            height="100%"
            src={player}
            scrolling="0"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      )}
      {type === 'fbo' && (
        <div hidden={!!sourcePath} style={{ color: '#fff' }}>
          {t('film-watch:loading')}
        </div>
      )}
      <div hidden={type !== 'fbo' || !sourcePath}>
        <PlyrPlayer
          ref={plyrRef}
          source={{ type: 'video', sources: [{ src: sourcePath, provider: 'html5' }] }}
        />
      </div>
    </>
  );
}
