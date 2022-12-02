import Heading from '@common/Base/Heading';
import { MovieType } from '@const/types';
import { getMovies } from '@models/moviesModel';
import useTranslation from 'next-translate/useTranslation';
import React, { useEffect, useState } from 'react';
import FilmsSlider from '../Slider';

type Props = React.ComponentProps<typeof FilmsSlider> & {
  title?: string;
  search?: any;
};

export default function FilmsDetailSuggestion(props: Props) {
  const { title, search, ...restProps } = props;
  const { t } = useTranslation();

  const [newMovies, setNewMovies] = useState<MovieType[]>([]);

  useEffect(() => {
    (async () => {
      const movies = await getMovies({ params: { search, pageSize: 12 } });
      setNewMovies(movies?.getMovies?.data?.items || []);
    })();
  }, [search]);

  return (
    <div>
      <Heading>{title || t('common:heading.film.suggestion')}</Heading>
      <FilmsSlider items={newMovies} {...restProps} />
    </div>
  );
}
