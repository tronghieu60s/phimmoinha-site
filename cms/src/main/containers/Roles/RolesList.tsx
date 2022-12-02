import TableActions from '@common/Base/Table/TableActions';
import TableListControl from '@common/Base/Table/TableListControl';
import {
  capitalize,
  isEmptyObject,
  objectToQueryParams,
  queryParamsToObject,
} from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { deleteRole } from '@service/role/role.model';
import { roleIdState, rolesState } from '@service/role/role.reducer';
import { RoleFilter, RoleSort } from '@service/role/role.types';
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
import { useColumns } from './RolesHooks';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

type Props = {
  query: {
    page?: number | null;
    page_size?: number | null;
  };
};

export default function RolesList(props: Props) {
  const {
    query: { page, page_size },
  } = props;

  const navigate = useNavigate();
  const { search: queryParams } = useLocation();
  const objectQueryParams = useMemo(() => queryParamsToObject(queryParams), [queryParams]);

  const [sort, setSort] = useState<RoleSort>({});
  const [filter, setFilter] = useState<RoleFilter>({});
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
  const [roleId, setRoleId] = useRecoilState(roleIdState);
  const onResetRoleId = useResetRecoilState(roleIdState);
  const { state, contents: roles } = useRecoilValueLoadable(rolesState(params));
  const onRolesRefresh = useRecoilRefresher_UNSTABLE(rolesState(params));

  useEffect(
    () => setPagination((prev) => ({ ...prev, total: roles?.Pagination?.Total || 0 })),
    [roles],
  );

  useEffect(() => {
    if (!roleId) {
      setSelectedRowKeys([]);
    }
  }, [roleId]);

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
    onResetRoleId();
    setSelectedRowKeys([]);
    navigate('?');
  }, [navigate, onResetRoleId]);

  const onSelect = useCallback(
    (rowKeys) => {
      setRoleId(rowKeys[0]);
      setSelectedRowKeys(rowKeys);
    },
    [setRoleId],
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
            ? { [s.field as keyof RoleSort]: capitalize(s.order?.slice(0, -3) || 'asc') }
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
      deleteRole(id).then((res) => {
        if (res?.deleteRole?.RowsAffected === 1) {
          onRolesRefresh();
          setSelectedRowKeys([]);
          return notificationSuccess(t('roles:actions.delete.succeed'));
        }
        return notificationError(t('roles:actions.delete.failed'));
      }),
    [onRolesRefresh],
  );

  return (
    <>
      <TableActions pagination={pagination} onReset={onReset} onRefresh={onRolesRefresh} />
      <TableListControl
        loading={state === 'loading'}
        dataSource={roles?.Items}
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
