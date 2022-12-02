import TableActions from '@common/Base/Table/TableActions';
import TableListControl from '@common/Base/Table/TableListControl';
import Section from '@common/Base/UI/Section';
import {
  capitalize,
  isEmptyObject,
  objectToQueryParams,
  queryParamsToObject,
} from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { deleteManyMovies, deleteTrashMovies, restoreManyMovies } from '@service/movie/movie.model';
import { moviesState } from '@service/movie/movie.reducer';
import { MovieFilter, MovieSort, MovieStatusType } from '@service/movie/movie.types';
import { Button, Popconfirm, Space, TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { File, Trash, XOctagon } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { useColumns } from './MoviesHooks';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

type Props = {
  query: {
    page?: number | null;
    page_size?: number | null;
    status: MovieStatusType | MovieStatusType[] | null;
  };
};

export default function MoviesList(props: Props) {
  const {
    query: { page, page_size, status },
  } = props;

  const navigate = useNavigate();
  const { search: queryParams } = useLocation();
  const objectQueryParams = useMemo(() => queryParamsToObject(queryParams), [queryParams]);

  const [sort, setSort] = useState<MovieSort>({ Id: 'Desc' });
  const [filter, setFilter] = useState<MovieFilter>({
    Status: { In: (Array.isArray(status) ? status : [status]) as string[] },
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: page || 1,
    pageSize: page_size || Number(APP_LIMIT_PAGINATION),
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const params = useMemo(
    () => ({
      sort,
      filter,
      pagination: {
        Page: pagination.current,
        PageSize: pagination.pageSize,
      },
    }),
    [sort, filter, pagination],
  );
  const { state, contents: movies } = useRecoilValueLoadable(moviesState(params));
  const onMoviesRefresh = useRecoilRefresher_UNSTABLE(moviesState(params));

  useEffect(
    () => setPagination((prev) => ({ ...prev, total: movies?.Pagination?.Total || 0 })),
    [movies],
  );

  const onReset = useCallback(() => {
    setSort({});
    setFilter({});
    setPagination((prev) => ({ ...prev, current: 1 }));
    setSelectedRowKeys([]);
    navigate('?');
  }, [navigate]);

  const onChange = useCallback(
    (
      e: TablePaginationConfig,
      f: Record<string, FilterValue | null>,
      s: SorterResult<any> | SorterResult<any>[],
    ) => {
      const { total = 0, current = 1, pageSize = Number(APP_LIMIT_PAGINATION) } = e;

      const fParams = {
        sort:
          !isEmptyObject(s) && !(s instanceof Array)
            ? { [s.field as keyof MovieSort]: capitalize(s.order?.slice(0, -3) || 'asc') }
            : {},
        filter: {
          Title: { Ct: f.Title?.[0] as string },
          Status: { Eq: f.Status?.[0] as MovieStatusType },
        },
      };
      setSort(fParams.sort);
      setFilter(fParams.filter);

      const nParams = {
        ...objectQueryParams,
        page: current,
        page_size: pageSize,
        params: JSON.stringify(fParams),
      };
      if (current === 1) {
        delete nParams.page;
      }
      if (pageSize === Number(APP_LIMIT_PAGINATION)) {
        delete nParams.page_size;
      }

      setPagination({ total, current, pageSize });
      navigate(`?${objectToQueryParams(nParams)}`, { replace: true });
    },
    [navigate, objectQueryParams],
  );

  const onDeleteItems = useCallback(
    async () =>
      deleteManyMovies(selectedRowKeys).then((res) => {
        const text = status === 'Trash' ? 'delete' : 'trash';

        if (res?.deleteManyMovies?.RowsAffected === selectedRowKeys.length) {
          onMoviesRefresh();
          setSelectedRowKeys([]);
          return notificationSuccess(t(`movies:actions.${text}.succeed`));
        }

        return notificationError(t(`movies:actions.${text}.failed`));
      }),
    [onMoviesRefresh, status, selectedRowKeys],
  );

  const onRecoverItems = useCallback(
    async (ids) =>
      restoreManyMovies(ids || selectedRowKeys).then((res) => {
        if (res?.restoreManyMovies?.RowsAffected === (ids || selectedRowKeys).length) {
          onMoviesRefresh();
          setSelectedRowKeys([]);
          return notificationSuccess(t('movies:actions.recover.succeed'));
        }

        return notificationError(t('movies:actions.recover.failed'));
      }),
    [onMoviesRefresh, selectedRowKeys],
  );

  const onEmptyTrash = useCallback(async () => {
    await deleteTrashMovies().then((res) => {
      if (res?.deleteTrashMovies?.RowsAffected === selectedRowKeys.length) {
        onMoviesRefresh();
        setSelectedRowKeys([]);
        return notificationSuccess(t('movies:actions.delete.succeed'));
      }

      return notificationError(t('movies:actions.delete.failed'));
    });
  }, [onMoviesRefresh, selectedRowKeys.length]);

  return (
    <>
      <Space>
        <Button
          type="link"
          icon={<File size={14} className="mr-2" />}
          onClick={() => navigate('/movies/list')}
        >
          {t('common:actions.all')}
        </Button>
        <Button
          danger
          type="link"
          icon={<Trash size={14} className="mr-2" />}
          onClick={() => navigate('/movies/trash')}
        >
          {t('common:actions.trash')}
        </Button>
      </Space>
      <Section />
      <TableActions
        pagination={pagination}
        onAdd={() => navigate('/movies/create')}
        onReset={onReset}
        onRefresh={onMoviesRefresh}
        rightChildren={
          status === 'Trash' &&
          (movies?.Items?.length || 0) > 0 && (
            <Popconfirm title={t('common:selected.confirm.delete.trash')} onConfirm={onEmptyTrash}>
              <Button danger icon={<XOctagon size={14} className="mr-2" />}>
                {t('common:actions.clear.trash')}
              </Button>
            </Popconfirm>
          )
        }
      />
      <TableListControl
        scroll={{ x: 1500 }}
        loading={state === 'loading'}
        dataSource={movies?.Items}
        columns={useColumns({ onRecoverItems })}
        pagination={pagination}
        confirmDelete={status === 'Trash'}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onChange={onChange}
        onDeleteItems={onDeleteItems}
      />
    </>
  );
}
