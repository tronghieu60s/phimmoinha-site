import Tags from '@common/Base/Tags';
import FilmsDetailSuggestion from '@components/Films/Detail/FilmsDetailSuggestion';
import { MOVIE_INFO } from '@const/path';
import { EXTRA_WIDTH, LARGE_WIDTH, MEDIUM_WIDTH } from '@const/responsive';
import { MovieType, TermType } from '@const/types';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const FacebookComment = dynamic(() => import('@common/Base/Facebook/FacebookComment'), {
  suspense: true,
});

type Props = {
  tags: TermType[];
  movies: MovieType[];
};

export default function Sidebar(props: Props) {
  const { tags, movies } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const onRandomMovie = useCallback(() => {
    const random = Math.floor(Math.random() * movies.length);
    const movie = movies[random];
    router.push(`/${MOVIE_INFO}/${movie?.movie_slug}`);
  }, [movies, router]);

  return (
    <div className="pm-main-sidebar">
      <div className="pm-main-section">
        <h2 className="pm-main-sidebar-title">{t('common:sider.random.title')}</h2>
        <div className="pm-main-sidebar-content">
          <p>{t('common:sider.random.description')}</p>
          <button
            type="button"
            title={`${t('common:sider.random.watch')} ${t('common:sider.random.text')}`}
            className="pm-common-button"
            onClick={onRandomMovie}
          >
            {t('common:sider.random.watch')} <strong>{t('common:sider.random.text')}</strong>
          </button>
        </div>
      </div>
      <div className="pm-main-section">
        <h2 className="pm-main-sidebar-title">{t('common:sider.movies.news.title')}</h2>
        <div className="pm-main-sidebar-content">
          <ul className="pm-main-sidebar-film">
            {movies?.slice(0, 10)?.map((movie) => (
              <li key={movie._id} className="pm-main-sidebar-film-item">
                <Link href={`/${MOVIE_INFO}/${movie.movie_slug}`}>
                  <a title={movie.movie_title}>
                    <span>{movie.movie_title}</span>
                    <span>
                      {movie.movie_episodes?.length
                        ? `${
                            movie.movie_episodes?.[(movie.movie_episodes?.length || 0) - 1]
                              ?.episode_name
                          }`
                        : t('common:text.trailer')}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="pm-main-section">
        <h2 className="pm-main-sidebar-title">{t('common:sider.qa.title')}</h2>
        <div className="pm-main-sidebar-content">
          <FacebookComment numPosts={8} />
        </div>
      </div>
      <div className="pm-main-section">
        <h2 className="pm-main-sidebar-title">{t('common:sider.movies.suggestion.title')}</h2>
        <div className="pm-main-sidebar-content">
          <FilmsDetailSuggestion
            slidesToShow={2}
            slidesToScroll={2}
            responsive={[
              {
                breakpoint: MEDIUM_WIDTH,
                settings: { slidesToShow: 2, slidesToScroll: 2 },
              },
              {
                breakpoint: LARGE_WIDTH,
                settings: { slidesToShow: 3, slidesToScroll: 3 },
              },
              {
                breakpoint: EXTRA_WIDTH,
                settings: { slidesToShow: 1, slidesToScroll: 1 },
              },
            ]}
          />
        </div>
      </div>
      <div className="pm-main-section">
        <h2 className="pm-main-sidebar-title">{t('common:sider.tags.title')}</h2>
        <div className="pm-main-sidebar-content">
          <Tags items={tags} />
        </div>
      </div>
    </div>
  );
}
