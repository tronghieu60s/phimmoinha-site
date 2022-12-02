import TableActions from '@common/Base/Table/TableActions';
import TableListControl from '@common/Base/Table/TableListControl';
import {
  capitalize,
  isEmptyObject,
  objectToQueryParams,
  queryParamsToObject,
} from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { deleteLibrary } from '@service/library/library.model';
import { libraryIdState, librariesState } from '@service/library/library.reducer';
import { LibraryFilter, LibrarySort } from '@service/library/library.types';
import { TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValueLoadable,
  useResetRecoilState,
} from 'recoil';
import { useColumns } from './LibrariesHooks';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

type Props = {
  query: {
    page?: number | null;
    page_size?: number | null;
  };
};

export default function LibrariesList(props: Props) {
  const {
    query: { page, page_size },
  } = props;

  const navigate = useNavigate();
  const { search: queryParams } = useLocation();
  const objectQueryParams = useMemo(() => queryParamsToObject(queryParams), [queryParams]);

  const [sort, setSort] = useState<LibrarySort>({ Id: 'Desc' });
  const [filter, setFilter] = useState<LibraryFilter>({});
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
  const [libraryId, setLibraryId] = useRecoilState(libraryIdState);
  const onResetLibraryId = useResetRecoilState(libraryIdState);
  const { state, contents: libraries } = useRecoilValueLoadable(librariesState(params));
  const onLibrariesRefresh = useRecoilRefresher_UNSTABLE(librariesState(params));

  useEffect(
    () => setPagination((prev) => ({ ...prev, total: libraries?.Pagination?.Total || 0 })),
    [libraries],
  );

  useEffect(() => {
    if (!libraryId) {
      setSelectedRowKeys([]);
    }
  }, [libraryId]);

  useEffect(() => {
    if (!objectQueryParams.params) {
      return;
    }
    setSort(JSON.parse(objectQueryParams.params).sort);
    setFilter(JSON.parse(objectQueryParams.params).filter);
  }, [objectQueryParams.params]);

  const onReset = useCallback(() => {
    setSort({});
    setFilter({});
    setPagination((prev) => ({ ...prev, current: 1 }));
    onResetLibraryId();
    setSelectedRowKeys([]);
    navigate('?');
  }, [navigate, onResetLibraryId]);

  const onSelect = useCallback(
    (rowKeys) => {
      setLibraryId(rowKeys[0]);
      setSelectedRowKeys(rowKeys);
    },
    [setLibraryId],
  );

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
            ? { [s.field as keyof LibrarySort]: capitalize(s.order?.slice(0, -3) || 'asc') }
            : {},
        filter: {
          Type: { Ct: f.Type?.[0] as string },
          Key: { Ct: f.Key?.[0] as string },
          Value: { Ct: f.Value?.[0] as string },
          Color: { Ct: f.Color?.[0] as string },
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

  const onDeleteItem = useCallback(
    async (id: number) =>
      deleteLibrary(id).then((res) => {
        if (res?.deleteLibrary?.RowsAffected === 1) {
          onLibrariesRefresh();
          setSelectedRowKeys([]);
          return notificationSuccess(t('libraries:actions.delete.succeed'));
        }
        return notificationError(t('libraries:actions.delete.failed'));
      }),
    [onLibrariesRefresh],
  );

  return (
    <>
      <TableActions pagination={pagination} onReset={onReset} onRefresh={onLibrariesRefresh} />
      <TableListControl
        loading={state === 'loading'}
        dataSource={libraries?.Items}
        columns={useColumns({ onDeleteItem })}
        pagination={pagination}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={onSelect}
        onChange={onChange}
        rowSelection={{ type: 'radio' }}
      />
    </>
  );
}
