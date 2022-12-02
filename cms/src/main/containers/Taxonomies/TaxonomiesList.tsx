import TableActions from '@common/Base/Table/TableActions';
import TableListControl from '@common/Base/Table/TableListControl';
import {
  capitalize,
  isEmptyObject,
  objectToQueryParams,
  queryParamsToObject,
} from '@core/commonFuncs';
import { notificationError, notificationSuccess } from '@core/notification';
import { deleteManyTaxonomies } from '@service/taxonomy/taxonomy.model';
import { taxonomiesState, taxonomyIdState } from '@service/taxonomy/taxonomy.reducer';
import { TaxonomyFilter, TaxonomyMetaType, TaxonomySort } from '@service/taxonomy/taxonomy.types';
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
import { useColumns } from './TaxonomiesHooks';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

type Props = {
  query: {
    page?: number | null;
    page_size?: number | null;
    type: TaxonomyMetaType;
  };
};

export default function TaxonomiesList(props: Props) {
  const {
    query: { page, page_size, type },
  } = props;

  const navigate = useNavigate();
  const { search: queryParams } = useLocation();
  const objectQueryParams = useMemo(() => queryParamsToObject(queryParams), [queryParams]);

  const [sort, setSort] = useState<TaxonomySort>({ Id: 'Desc' });
  const [filter, setFilter] = useState<TaxonomyFilter>({});
  const [pagination, setPagination] = useState({
    total: 0,
    current: page || 1,
    pageSize: page_size || Number(APP_LIMIT_PAGINATION),
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const params = useMemo(
    () => ({
      sort,
      filter: {
        ...filter,
        ...{ Type: { Eq: type } },
      },
      pagination: {
        Page: pagination.current,
        PageSize: pagination.pageSize,
      },
    }),
    [sort, filter, type, pagination],
  );
  const [taxonomyId, setTaxonomyId] = useRecoilState(taxonomyIdState);
  const onResetTaxonomyId = useResetRecoilState(taxonomyIdState);
  const { state, contents: taxonomies } = useRecoilValueLoadable(taxonomiesState(params));
  const onTaxonomiesRefresh = useRecoilRefresher_UNSTABLE(taxonomiesState(params));

  useEffect(
    () => setPagination((prev) => ({ ...prev, total: taxonomies?.Pagination?.Total || 0 })),
    [taxonomies],
  );

  useEffect(() => {
    if (!taxonomyId) {
      setSelectedRowKeys([]);
    }
  }, [taxonomyId]);

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
    onResetTaxonomyId();
    setSelectedRowKeys([]);
    navigate(`?type=${type}`);
  }, [navigate, onResetTaxonomyId, type]);

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
            ? { [s.field as keyof TaxonomySort]: capitalize(s.order?.slice(0, -3) || 'asc') }
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

  const onDeleteItems = useCallback(
    async () =>
      deleteManyTaxonomies(selectedRowKeys).then((res) => {
        if (res?.deleteManyTaxonomies?.RowsAffected === selectedRowKeys.length) {
          onTaxonomiesRefresh();
          setSelectedRowKeys([]);
          return notificationSuccess(t('taxonomies:actions.delete.succeed'));
        }
        return notificationError(t('taxonomies:actions.delete.failed'));
      }),
    [onTaxonomiesRefresh, selectedRowKeys],
  );

  return (
    <>
      <TableActions pagination={pagination} onReset={onReset} onRefresh={onTaxonomiesRefresh} />
      <TableListControl
        loading={state === 'loading'}
        dataSource={taxonomies?.Items}
        columns={useColumns({ onSelect: (rowKey) => setTaxonomyId(rowKey) })}
        pagination={pagination}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onChange={onChange}
        onDeleteItems={onDeleteItems}
      />
    </>
  );
}
