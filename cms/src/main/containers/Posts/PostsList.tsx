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
import { deleteManyPosts, deleteTrashPosts, restoreManyPosts } from '@service/post/post.model';
import { postsState } from '@service/post/post.reducer';
import { PostFilter, PostMetaType, PostSort, PostStatusType } from '@service/post/post.types';
import { Button, Popconfirm, Space, TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { File, Trash, XOctagon } from 'react-feather';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from 'recoil';
import { useColumns } from './PostsHooks';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

type Props = {
  query: {
    page?: number | null;
    page_size?: number | null;
    type: PostMetaType;
    status: PostStatusType | PostStatusType[] | null;
  };
};

export default function PostsList(props: Props) {
  const {
    query: { page, page_size, type, status },
  } = props;

  const navigate = useNavigate();
  const { search: queryParams } = useLocation();
  const objectQueryParams = useMemo(() => queryParamsToObject(queryParams), [queryParams]);

  const [sort, setSort] = useState<PostSort>({ Id: 'Desc' });
  const [filter, setFilter] = useState<PostFilter>({
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
      filter: {
        ...filter,
        Type: { Eq: type },
      },
      pagination: {
        Page: pagination.current,
        PageSize: pagination.pageSize,
      },
    }),
    [sort, filter, type, pagination],
  );
  const { state, contents: posts } = useRecoilValueLoadable(postsState(params));
  const onPostsRefresh = useRecoilRefresher_UNSTABLE(postsState(params));

  useEffect(
    () => setPagination((prev) => ({ ...prev, total: posts?.Pagination?.Total || 0 })),
    [posts],
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
            ? { [s.field as keyof PostSort]: capitalize(s.order?.slice(0, -3) || 'asc') }
            : {},
        filter: {
          Title: { Ct: f.Title?.[0] as string },
          Status: { Eq: f.Status?.[0] as PostStatusType },
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
      deleteManyPosts(selectedRowKeys).then((res) => {
        const text = status === 'Trash' ? 'delete' : 'trash';

        if (res?.deleteManyPosts?.RowsAffected === selectedRowKeys.length) {
          onPostsRefresh();
          setSelectedRowKeys([]);
          return notificationSuccess(t(`posts:actions.${text}.succeed`));
        }

        return notificationError(t(`posts:actions.${text}.failed`));
      }),
    [onPostsRefresh, status, selectedRowKeys],
  );

  const onRecoverItems = useCallback(
    async (ids) =>
      restoreManyPosts(ids || selectedRowKeys).then((res) => {
        if (res?.restoreManyPosts?.RowsAffected === (ids || selectedRowKeys).length) {
          onPostsRefresh();
          setSelectedRowKeys([]);
          return notificationSuccess(t('posts:actions.recover.succeed'));
        }

        return notificationError(t('posts:actions.recover.failed'));
      }),
    [onPostsRefresh, selectedRowKeys],
  );

  const onEmptyTrash = useCallback(async () => {
    await deleteTrashPosts().then((res) => {
      if (res?.deleteTrashPosts?.RowsAffected === selectedRowKeys.length) {
        onPostsRefresh();
        setSelectedRowKeys([]);
        return notificationSuccess(t('posts:actions.delete.succeed'));
      }

      return notificationError(t('posts:actions.delete.failed'));
    });
  }, [onPostsRefresh, selectedRowKeys.length]);

  return (
    <>
      <Space>
        <Button
          type="link"
          icon={<File size={14} className="mr-2" />}
          onClick={() => navigate(`/${type.toLowerCase()}s/list`)}
        >
          {t('common:actions.all')}
        </Button>
        <Button
          danger
          type="link"
          icon={<Trash size={14} className="mr-2" />}
          onClick={() => navigate(`/${type.toLowerCase()}s/trash`)}
        >
          {t('common:actions.trash')}
        </Button>
      </Space>
      <Section />
      <TableActions
        pagination={pagination}
        onAdd={() => navigate(`/${type.toLowerCase()}s/create`)}
        onReset={onReset}
        onRefresh={onPostsRefresh}
        rightChildren={
          status === 'Trash' &&
          (posts?.Items?.length || 0) > 0 && (
            <Popconfirm title={t('common:selected.confirm.delete.trash')} onConfirm={onEmptyTrash}>
              <Button danger icon={<XOctagon size={14} className="mr-2" />}>
                {t('common:actions.clear.trash')}
              </Button>
            </Popconfirm>
          )
        }
      />
      <TableListControl
        scroll={{ x: 1100 }}
        loading={state === 'loading'}
        dataSource={posts?.Items}
        columns={useColumns({ type, onRecoverItems })}
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
