import { useLocaleMessages } from '@hooks/useTableHooks';
import { tableRangeState } from '@service/theme/theme.reducer';
import { Alert, Button, Popconfirm, Table } from 'antd';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';

type Props = {
  selectedRowKeys?: never[];
  setSelectedRowKeys?: React.Dispatch<React.SetStateAction<never[]>>;
  confirmDelete?: boolean;
  onDeleteItems?: () => void;
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
};

export default function TableListControl(props: React.ComponentProps<typeof Table> & Props) {
  const {
    pagination,
    rowSelection,
    selectedRowKeys = [],
    setSelectedRowKeys,
    confirmDelete = true,
    onDeleteItems,
    leftChildren,
    rightChildren,
  } = props;

  const tableRange = useRecoilValue(tableRangeState);

  const action = useMemo(
    () =>
      confirmDelete ? (
        <Popconfirm
          title={t('common:selected.confirm.delete', {
            num: selectedRowKeys?.length,
          })}
          onConfirm={onDeleteItems}
        >
          <Button type="link" danger>
            {t('common:selected.delete', {
              num: selectedRowKeys?.length,
            })}
          </Button>
        </Popconfirm>
      ) : (
        <Button type="link" danger onClick={onDeleteItems}>
          {t('common:selected.delete', {
            num: selectedRowKeys?.length,
          })}
        </Button>
      ),
    [confirmDelete, onDeleteItems, selectedRowKeys?.length],
  );

  return (
    <>
      {selectedRowKeys?.length > 0 && (rowSelection?.type || 'checkbox') === 'checkbox' && (
        <Alert
          message={
            <>
              <span>
                {t('common:selected', {
                  num: selectedRowKeys?.length,
                })}
              </span>
              <Button type="link" onClick={() => setSelectedRowKeys && setSelectedRowKeys([])}>
                {t('common:selected.cancel')}
              </Button>
              {leftChildren}
            </>
          }
          type="info"
          action={
            <>
              {rightChildren}
              {onDeleteItems && action}
            </>
          }
        />
      )}
      <Table
        rowKey="Id"
        size={tableRange}
        locale={useLocaleMessages()}
        {...props}
        pagination={
          pagination && {
            showTotal: (num, range) =>
              t('common:table.total', { start: range[0], end: range[1], total: num }),
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '25', '50', '100'],
            ...pagination,
          }
        }
        rowSelection={
          setSelectedRowKeys && {
            type: 'checkbox',
            hideSelectAll: true,
            selectedRowKeys,
            onChange: (o: any) => setSelectedRowKeys && setSelectedRowKeys(o),
            ...rowSelection,
          }
        }
      />
    </>
  );
}
