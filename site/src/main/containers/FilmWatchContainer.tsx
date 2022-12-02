import Breadcrumb from '@common/Base/Breadcrumb';
import { InView } from '@common/Base/IntersectionObserver';
import Section from '@common/Base/Section';
import FilmsDetailEpisode from '@components/Films/Detail/FilmsDetailEpisode';
import FilmsDetailList from '@components/Films/Detail/FilmsDetailList';
import FilmsDetailServer from '@components/Films/Detail/FilmsDetailServer';
import FilmsDetailSuggestion from '@components/Films/Detail/FilmsDetailSuggestion';
import FilmsDetailTags from '@components/Films/Detail/FilmsDetailTags';
import FilmsDetailTop from '@components/Films/Detail/FilmsDetailTop';
import FilmWatchControl from '@components/Films/Watch/FilmWatchControl';
import FilmWatchIframe from '@components/Films/Watch/FilmWatchIframe';
import { SAVE_HISTORY_REPORT, TIMEOUT_REPORT } from '@const/config';
import { HISTORY_LIST, MOVIE_INFO } from '@const/path';
import { FOLLOWED_STORAGE, REPORT_STORAGE, WATCHED_STORAGE } from '@const/storage';
import { BreadcrumbType, MovieEpisodeType, MovieType, ServerWatchType } from '@const/types';
import { getIdYoutubeFromUrl, isBrowser } from '@core/commonFuncs';
import { reportMovie } from '@models/moviesModel';
import { addListener, launch } from 'devtools-detector';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

type Props = {
  movie: MovieType;
  episode: string;
  breadcrumb: BreadcrumbType[];
};

const FacebookComment = dynamic(() => import('@common/Base/Facebook/FacebookComment'), {
  suspense: true,
});

const getInitialServer = (episode: MovieEpisodeType): ServerWatchType | undefined => {
  const { episode_server } = episode || {};
  if (episode_server?.episode_server_fbo) {
    return 'fbo';
  }
  if (episode_server?.episode_server_hydrax) {
    return 'hydrax';
  }
  return undefined;
};

const getSrcFromServer = (episode: MovieEpisodeType, server: ServerWatchType | undefined) => {
  const { episode_server } = episode || {};
  if (server === 'fbo') {
    return episode_server?.episode_server_fbo;
  }
  if (server === 'hydrax') {
    return episode_server?.episode_server_hydrax;
  }
  return undefined;
};

export default function FilmWatchContainer(props: Props) {
  const { movie, episode, breadcrumb } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const { asPath } = router;

  const iframeRef = useRef<HTMLDivElement>(null);
  const episodeRef = useRef<HTMLDivElement>(null);
  const [following, setFollowing] = useState(false);

  const currentEpisode = useMemo(
    () => movie?.movie_episodes?.find((item) => item.episode_slug === episode) || {},
    [episode, movie?.movie_episodes],
  );

  const [serverSelected, setServerSelected] = useState(getInitialServer(currentEpisode));

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    addListener((isOpen) => {
      if (isOpen) {
        iframeRef.current?.remove();
        episodeRef.current?.remove();
      }
    });
    launch();
  }, [router, t]);

  useEffect(() => {
    if (iframeRef.current && serverSelected) {
      const topIframe = iframeRef.current?.offsetTop;
      window.scrollTo({
        top: topIframe - 20, // padding 20px
        behavior: 'smooth',
      });
    }
  }, [iframeRef, serverSelected, router]);

  useEffect(() => {
    const initialServer = getInitialServer(currentEpisode);
    setServerSelected(initialServer);
  }, [currentEpisode]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const watchedStorage = localStorage.getItem(WATCHED_STORAGE);
      let watched = watchedStorage ? JSON.parse(watchedStorage) : [];
      watched = watched.filter((watch: string) => watch !== movie._id);
      watched.unshift(movie?._id);
      localStorage.setItem(WATCHED_STORAGE, JSON.stringify(watched));
    }, SAVE_HISTORY_REPORT);
    return () => clearTimeout(timeout);
  }, [movie, movie._id]);

  useEffect(() => {
    const followedStorage = localStorage.getItem(FOLLOWED_STORAGE);
    const followed = followedStorage ? JSON.parse(followedStorage) : [];
    const isFollowing = followed.find((follow: string) => follow === movie._id);
    if (isFollowing) setFollowing(true);
  }, [movie, movie._id]);

  const movieTags = useMemo(
    () => movie?.terms?.filter((term) => term.term_taxonomy === 'movie_tag') || [],
    [movie?.terms],
  );

  const getIsReported = useCallback(() => {
    const reportStorage = localStorage.getItem(REPORT_STORAGE);
    const reported = reportStorage ? JSON.parse(reportStorage) : {};
    if (movie._id) return reported[movie._id] - new Date().getTime() + TIMEOUT_REPORT > 0;
    return false;
  }, [movie]);

  const onWatchNext = useCallback(() => {
    const currentIndex =
      movie?.movie_episodes?.findIndex((item) => item.episode_slug === episode) || 0;
    if (currentIndex !== -1) {
      const nextEpisode = movie?.movie_episodes?.[currentIndex + 1] || movie?.movie_episodes?.[0];
      if (nextEpisode) {
        router.push(`/${MOVIE_INFO}/${movie?.movie_slug}/${nextEpisode.episode_slug}`);
      }
    }
  }, [episode, movie?.movie_episodes, movie?.movie_slug, router]);

  const onWatchHistory = useCallback(() => router.push(`/${HISTORY_LIST}`), [router]);

  const onWatchFollow = useCallback(() => {
    const followedStorage = localStorage.getItem(FOLLOWED_STORAGE);
    let followed = followedStorage ? JSON.parse(followedStorage) : [];
    followed = followed.filter((follow: string) => follow !== movie._id);
    if (following) {
      setFollowing(false);
      toast.success(t('common:alert.unfollow.success'));
    } else {
      setFollowing(true);
      followed.unshift(movie?._id);
      toast.success(t('common:alert.followed.success'));
    }
    localStorage.setItem(FOLLOWED_STORAGE, JSON.stringify(followed));
  }, [following, movie._id, t]);

  const onWatchReport = useCallback(async () => {
    if (isBrowser() && getIsReported()) {
      toast.error(t('common:alert.reported.block'));
      return;
    }

    toast
      .promise(reportMovie({ id: movie?._id, report_reason: 'Error link' }), {
        loading: t('common:alert.sending'),
        success: t('common:alert.reported.success'),
        error: t('common:alert.reported.error'),
      })
      .then(() => {
        const reportStorage = localStorage.getItem(REPORT_STORAGE);
        const reported = reportStorage ? JSON.parse(reportStorage) : {};
        if (movie?._id && !getIsReported()) {
          reported[movie._id] = new Date().getTime();
          localStorage.setItem(REPORT_STORAGE, JSON.stringify(reported));
        }
      });
  }, [getIsReported, movie._id, t]);

  return (
    <>
      <Section ref={iframeRef}>
        <Breadcrumb items={breadcrumb} />
        <FilmsDetailTop movie={movie} />
        <FilmsDetailServer
          items={currentEpisode?.episode_server}
          selected={serverSelected}
          onSelect={(server) => setServerSelected(server)}
        />
        <div className="pm-main-film-info-frame">
          <FilmWatchIframe
            type={serverSelected}
            title={movie?.movie_title}
            player={getSrcFromServer(currentEpisode, serverSelected)}
            trailer={getIdYoutubeFromUrl(movie?.meta?.movie_trailer)}
          />
        </div>
        <FilmWatchControl
          following={following}
          onWatchNext={onWatchNext}
          onWatchHistory={onWatchHistory}
          onWatchFollow={onWatchFollow}
          onWatchReport={onWatchReport}
        />
      </Section>
      <Section ref={episodeRef} title={`${t('film-watch:title.episode')}:`}>
        <FilmsDetailEpisode
          items={movie?.movie_episodes}
          server={serverSelected}
          selected={episode}
        />
      </Section>
      <InView>
        {({ ref }) => (
          <Section ref={ref}>
            <FilmsDetailTop movie={movie} />
            <FilmsDetailList movie={movie} />
            <FilmsDetailTags items={movieTags} />
          </Section>
        )}
      </InView>
      <InView>
        {({ ref }) => (
          <Section ref={ref}>
            <FacebookComment href={asPath} />
          </Section>
        )}
      </InView>
      <InView>
        {({ ref }) => (
          <FilmsDetailSuggestion
            ref={ref}
            search={{ movie_type: movie.movie_type }}
            slidesToShow={4}
            slidesToScroll={4}
          />
        )}
      </InView>
    </>
  );
}
