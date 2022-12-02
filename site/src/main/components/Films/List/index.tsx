import { InView } from '@common/Base/IntersectionObserver';
import Pagination from '@common/Base/Pagination';
import { MovieType, PaginationType } from '@const/types';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import FilmsDetailSuggestion from '../Detail/FilmsDetailSuggestion';
import FilmsListItem from './FilmsListItem';

type Props = {
  items: MovieType[];
  pagination?: PaginationType;
  noSidebar?: boolean;
  showBigImage?: boolean;
  showSuggestion?: boolean;
};

const GoogleSearch = dynamic(() => import('@common/Base/Google/GoogleSearch'), {
  suspense: true,
});

export default function FilmsList(props: Props) {
  const { items, pagination, noSidebar, showBigImage, showSuggestion } = props;
  const { total = 0, page, pageSize } = pagination || {};
  const { t } = useTranslation();

  return (
    <>
      {!items.length && (
        <InView>
          {({ ref }) => (
            <div ref={ref}>
              <p className="pm-common-text">{t('common:search.empty')}</p>
              <GoogleSearch />
            </div>
          )}
        </InView>
      )}
      <ul className="pm-main-film-list">
        {items?.map((item, index) => (
          <FilmsListItem
            key={item._id}
            value={item}
            showBigImage={showBigImage && index === 0}
            noSidebar={noSidebar}
          />
        ))}
      </ul>
      {pagination && <Pagination total={total} page={page} pageSize={pageSize} />}
      {showSuggestion && (
        <InView>
          {({ ref }) => <FilmsDetailSuggestion ref={ref} slidesToShow={4} slidesToScroll={4} />}
        </InView>
      )}
    </>
  );
}
