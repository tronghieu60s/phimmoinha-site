import { useColumnSearchProps } from '@hooks/useTableHooks';
import { Popconfirm, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { t } from 'i18next';
import { useMemo } from 'react';
import { Trash } from 'react-feather';

export type FormType = {
  Name: string;
  Description: string;
};

export const initialValues: FormType = {
  Name: '',
  Description: '',
};

type Props = {
  onDeleteItem: (id: number) => void;
};

export const useColumns = (props: Props): ColumnsType<object> => {
  const { onDeleteItem } = props;

  const columns: ColumnsType<object> = useMemo(
    () => [
      {
        key: 'Name',
        title: t('roles:data.name'),
        dataIndex: 'Name',
        width: '25%',
        sorter: true,
        ...useColumnSearchProps(),
      },
      {
        key: 'Description',
        title: t('roles:data.description'),
        dataIndex: 'Description',
        render: (o) => o || '—',
        width: '60%',
        sorter: true,
        ...useColumnSearchProps(),
      },
      {
        key: 'actions',
        dataIndex: 'Id',
        align: 'center',
        fixed: 'right',
        render: (o) => (
          <Popconfirm
            title={t('common:selected.confirm.delete.single')}
            onConfirm={() => onDeleteItem(o)}
          >
            <Tooltip title={t('common:actions.delete')}>
              <Typography.Link>
                <Trash size={15} color="red" />
              </Typography.Link>
            </Tooltip>
          </Popconfirm>
        ),
        width: 70,
      },
    ],
    [onDeleteItem],
  );

  return columns;
};
