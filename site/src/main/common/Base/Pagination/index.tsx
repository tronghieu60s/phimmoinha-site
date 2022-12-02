import { PAGE } from '@const/path';
import { getPaginate } from '@core/commonFuncs';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';

const PAGINATION_DEFAULT_LIMIT = process.env.NEXT_PUBLIC_APP_PAGINATION_DEFAULT_LIMIT || 10;

type Props = {
  total: number;
  page?: number;
  pageSize?: number;
};

export default function Pagination(props: Props) {
  const { total, page: curPage = 1, pageSize = Number(PAGINATION_DEFAULT_LIMIT) } = props;
  const { t } = useTranslation();
  const { pathname: curPathName, query, route } = useRouter();

  const pathname = useMemo(
    () => (route.indexOf('[page]') > -1 ? curPathName : `${curPathName}/[page]`),
    [curPathName, route],
  );

  const paginate = useMemo(() => getPaginate(total, curPage, pageSize), [curPage, pageSize, total]);

  return (
    <ul className="pm-main-pagination" hidden={paginate.totalPages <= 1}>
      <li hidden={curPage <= 1}>
        <Link href={{ pathname, query: { ...query, page: `${PAGE}-${curPage - 1}` } }}>
          <a title={`${t('common:pagination.previous')}`}>
            <ArrowLeft size={12} />
          </a>
        </Link>
      </li>
      {paginate.pages?.map((page) => (
        <li key={page} className={`${page === curPage ? 'active' : ''}`}>
          <Link href={{ pathname, query: { ...query, page: `${PAGE}-${page}` } }}>
            <a title={`${t('common:pagination.page')} ${page}`}>{page}</a>
          </Link>
        </li>
      ))}
      <li hidden={curPage >= paginate.totalPages}>
        <Link href={{ pathname, query: { ...query, page: `${PAGE}-${curPage + 1}` } }}>
          <a title={`${t('common:pagination.next')}`}>
            <ArrowRight size={12} />
          </a>
        </Link>
      </li>
    </ul>
  );
}
