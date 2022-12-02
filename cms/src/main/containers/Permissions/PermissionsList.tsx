import TableActions from '@common/Base/Table/TableActions';
import TableListControl from '@common/Base/Table/TableListControl';
import {
  capitalize,
  isEmptyObject,
  objectToQueryParams,
  queryParamsToObject,
} from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { deletePermission } from '@service/permission/permission.model';
import { permissionIdState, permissionsState } from '@service/permission/permission.reducer';
import { PermissionFilter, PermissionSort } from '@service/permission/permission.types';
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
import { useColumns } from './PermissionsHooks';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

type Props = {
  query: {
    page?: number | null;
    page_size?: number | null;
  };
};

export default function PermissionsList(props: Props) {
  const {
    query: { page, page_size },
  } = props;

  const navigate = useNavigate();
  const { search: queryParams } = useLocation();
  const objectQueryParams = useMemo(() => queryParamsToObject(queryParams), [queryParams]);

  const [sort, setSort] = useState<PermissionSort>({});
  const [filter, setFilter] = useState<PermissionFilter>({});
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
  const [permissionId, setPermissionId] = useRecoilState(permissionIdState);
  const onResetPermissionId = useResetRecoilState(permissionIdState);
  const { state, contents: permissions } = useRecoilValueLoadable(permissionsState(params));
  const onPermissionsRefresh = useRecoilRefresher_UNSTABLE(permissionsState(params));

  useEffect(
    () => setPagination((prev) => ({ ...prev, total: permissions?.Pagination?.Total || 0 })),
    [permissions],
  );

  useEffect(() => {
    if (!permissionId) {
      setSelectedRowKeys([]);
    }
  }, [permissionId]);

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
    onResetPermissionId();
    setSelectedRowKeys([]);
    navigate('?');
  }, [navigate, onResetPermissionId]);

  const onSelect = useCallback(
    (rowKeys) => {
      setPermissionId(rowKeys[0]);
      setSelectedRowKeys(rowKeys);
    },
    [setPermissionId],
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
            ? { [s.field as keyof PermissionSort]: capitalize(s.order?.slice(0, -3) || 'asc') }
            : {},
        filter: {
          Name: { Ct: f.Name?.[0] as string },
          Description: { Ct: f.Description?.[0] as string },
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
      deletePermission(id).then((res) => {
        if (res?.deletePermission?.RowsAffected === 1) {
          onPermissionsRefresh();
          setSelectedRowKeys([]);
          return notificationSuccess(t('permissions:actions.delete.succeed'));
        }
        return notificationError(t('permissions:actions.delete.failed'));
      }),
    [onPermissionsRefresh],
  );

  return (
    <>
      <TableActions pagination={pagination} onReset={onReset} onRefresh={onPermissionsRefresh} />
      <TableListControl
        loading={state === 'loading'}
        dataSource={permissions?.Items}
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
