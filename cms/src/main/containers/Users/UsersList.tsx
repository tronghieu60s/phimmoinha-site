import TableActions from '@common/Base/Table/TableActions';
import TableListControl from '@common/Base/Table/TableListControl';
import {
  capitalize,
  isEmptyObject,
  objectToQueryParams,
  queryParamsToObject,
} from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { accessUserState } from '@service/auth/auth.reducer';
import { deleteManyUsers } from '@service/user/user.model';
import { usersState } from '@service/user/user.reducer';
import { UserFilter, UserSort, UserType } from '@service/user/user.types';
import { TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilRefresher_UNSTABLE, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { useColumns } from './UsersHooks';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

type Props = {
  query: {
    page?: number | null;
    page_size?: number | null;
  };
};

export default function UsersList(props: Props) {
  const {
    query: { page, page_size },
  } = props;

  const navigate = useNavigate();
  const { search: queryParams } = useLocation();
  const objectQueryParams = useMemo(() => queryParamsToObject(queryParams), [queryParams]);

  const user = useRecoilValue(accessUserState);

  const [sort, setSort] = useState<UserSort>({ Id: 'Desc' });
  const [filter, setFilter] = useState<UserFilter>({});
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
  const { state, contents: users } = useRecoilValueLoadable(usersState(params));
  const onUsersRefresh = useRecoilRefresher_UNSTABLE(usersState(params));

  useEffect(
    () => setPagination((prev) => ({ ...prev, total: users?.Pagination?.Total || 0 })),
    [users],
  );

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
            ? { [s.field as keyof UserSort]: capitalize(s.order?.slice(0, -3) || 'asc') }
            : {},
        filter: {
          UserName: { Ct: f.UserName?.[0] as string },
          Email: { Ct: f.Email?.[0] as string },
          FullName: { Ct: f.FullName?.[0] as string },
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
      deleteManyUsers(selectedRowKeys).then((res) => {
        if (res?.deleteManyUsers?.RowsAffected === selectedRowKeys.length) {
          onUsersRefresh();
          setSelectedRowKeys([]);
          return notificationSuccess(t('users:actions.delete.succeed'));
        }
        return notificationError(t('users:actions.delete.failed'));
      }),
    [onUsersRefresh, selectedRowKeys],
  );

  return (
    <>
      <TableActions
        pagination={pagination}
        onAdd={() => navigate('/users/create')}
        onReset={onReset}
        onRefresh={onUsersRefresh}
      />
      <TableListControl
        scroll={{ x: 1100 }}
        loading={state === 'loading'}
        dataSource={users?.Items}
        columns={useColumns()}
        pagination={pagination}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onChange={onChange}
        onDeleteItems={onDeleteItems}
        rowSelection={{
          getCheckboxProps: (o: UserType) => ({
            disabled: o.UserName === user.UserName || o.Role?.Name === 'Admin',
          }),
        }}
      />
    </>
  );
}
