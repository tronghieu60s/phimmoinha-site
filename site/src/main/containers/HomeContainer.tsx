import Heading from '@common/Base/Heading';
import FilmsList from '@components/Films/List';
import FilmsSlider from '@components/Films/Slider';
import { MovieType } from '@const/types';
import useTranslation from 'next-translate/useTranslation';

type Props = {
  filmsMovie: MovieType[];
  filmsSeries: MovieType[];
  filmsSuggestions: MovieType[];
  filmsUpcoming: MovieType[];
};

export default function HomeContainer(props: Props) {
  const { t } = useTranslation();
  const { filmsMovie, filmsSeries, filmsSuggestions, filmsUpcoming } = props;

  return (
    <>
      {filmsSuggestions.length > 0 && (
        <>
          <Heading>{t('home:heading.film.suggestion')}</Heading>
          <FilmsSlider items={filmsSuggestions} />
        </>
      )}
      {filmsMovie.length > 0 && (
        <>
          <Heading>{t('home:heading.film.movie')}</Heading>
          <FilmsList showBigImage items={filmsMovie} noSidebar />
        </>
      )}
      {filmsSeries.length > 0 && (
        <>
          <Heading>{t('home:heading.film.series')}</Heading>
          <FilmsList showBigImage items={filmsSeries} noSidebar />
        </>
      )}
      {filmsUpcoming.length > 0 && (
        <>
          <Heading>{t('home:heading.film.upcoming')}</Heading>
          <FilmsList items={filmsUpcoming} noSidebar />
        </>
      )}
    </>
  );
}
