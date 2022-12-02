import { ACTOR_LIST, COUNTRY_LIST, DIRECTOR_LIST, GENRE_LIST, PUBLISH_LIST } from '@const/path';
import { MovieType } from '@const/types';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react';

type Props = {
  movie?: MovieType;
};

export default function FilmsDetailList(props: Props) {
  const { movie } = props;
  const { t } = useTranslation();

  const movieActors = useMemo(
    () => movie?.terms?.filter((term) => term.term_taxonomy === 'movie_actor') || [],
    [movie?.terms],
  );

  const movieCountries = useMemo(
    () => movie?.terms?.filter((term) => term.term_taxonomy === 'movie_country') || [],
    [movie?.terms],
  );

  const movieDirectors = useMemo(
    () => movie?.terms?.filter((term) => term.term_taxonomy === 'movie_director') || [],
    [movie?.terms],
  );

  const movieCategories = useMemo(
    () => movie?.terms?.filter((term) => term.term_taxonomy === 'movie_category') || [],
    [movie?.terms],
  );

  return (
    <>
      <ul className="pm-main-film-info-list">
        <li className="pm-main-film-info-item">
          <span>{t('film-watch:info.quality')}:</span> {movie?.meta?.movie_quality}
        </li>
        <li className="pm-main-film-info-item">
          <span>{t('film-watch:info.duration')}:</span> {movie?.meta?.movie_duration}{' '}
          {t('common:text.minutes')}
        </li>
        <li className="pm-main-film-info-item">
          <span>{t('film-watch:info.publish')}:</span>{' '}
          <Link href={`/${PUBLISH_LIST}/${movie?.meta?.movie_publish}`}>
            <a title={`${t('film-watch:info.publish')} ${movie?.meta?.movie_publish}`}>
              {movie?.meta?.movie_publish}
            </a>
          </Link>
        </li>
        <li className="pm-main-film-info-item">
          <span>{t('film-watch:info.country')}:</span>{' '}
          {movieCountries?.map((term) => (
            <Link key={term._id} href={`/${COUNTRY_LIST}/${term?.term_slug}`}>
              <a title={`${t('film-watch:info.country')} ${term?.term_name}`}>
                {term?.term_name}
              </a>
            </Link>
          ))}
          {movieCountries.length === 0 && <span>{t('film-watch:info.updating')}...</span>}
        </li>
        <li className="pm-main-film-info-item">
          <span>{t('film-watch:info.director')}:</span>{' '}
          {movieDirectors?.map((term) => (
            <Link key={term._id} href={`/${DIRECTOR_LIST}/${term?.term_slug}`}>
              <a title={`${t('film-watch:info.director')} ${term?.term_name}`}>
                {term?.term_name}
              </a>
            </Link>
          ))}
          {movieDirectors.length === 0 && <a>{t('film-watch:info.updating')}...</a>}
        </li>
        <li className="pm-main-film-info-item">
          <span>{t('film-watch:info.actor')}:</span>{' '}
          {movieActors?.map((term) => (
            <Link key={term._id} href={`/${ACTOR_LIST}/${term?.term_slug}`}>
              <a title={`${t('film-watch:info.actor')} ${term?.term_name}`}>
                {term?.term_name}
              </a>
            </Link>
          ))}
          {movieActors.length === 0 && <a>{t('film-watch:info.updating')}...</a>}
        </li>
        <li className="pm-main-film-info-item">
          <span>{t('film-watch:info.genre')}:</span>{' '}
          {movieCategories?.map((term) => (
            <Link key={term._id} href={`/${GENRE_LIST}/${term?.term_slug}`}>
              <a title={`${t('film-watch:info.genre')} ${term?.term_name}`}>
                {term?.term_name}
              </a>
            </Link>
          ))}
          {movieCategories.length === 0 && <a>{t('film-watch:info.updating')}...</a>}
        </li>
      </ul>
      <div className="pm-main-film-banner">
        <Image src={movie?.meta?.movie_avatar || ''} alt={movie?.movie_title} layout="fill" />
      </div>
      <div
        className="pm-main-film-info-content"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: String(movie?.movie_content) }}
      />
    </>
  );
}
