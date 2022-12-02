import { stripHtml } from '@core/commonFuncs';
import { useColumnSearchProps } from '@hooks/useTableHooks';
import { Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { t } from 'i18next';
import { useMemo } from 'react';
import { Edit } from 'react-feather';

export type FormType = {
  Name: string;
  Slug: string;
  Description: string;
};

export const initialValues: FormType = {
  Name: '',
  Slug: '',
  Description: '',
};

type Props = {
  onSelect: (selectedRowKeys: number) => void;
};

export const useColumns = (props: Props): ColumnsType<object> => {
  const { onSelect } = props;

  const columns: ColumnsType<object> = useMemo(
    () => [
      {
        key: 'Name',
        title: t('taxonomies:data.name'),
        dataIndex: 'Name',
        width: '25%',
        sorter: true,
        ...useColumnSearchProps(),
      },
      {
        key: 'Slug',
        title: t('taxonomies:data.slug'),
        dataIndex: 'Slug',
        width: '25%',
        sorter: true,
        ...useColumnSearchProps(),
      },
      {
        key: 'Description',
        title: t('taxonomies:data.description'),
        dataIndex: ['Description'],
        sorter: true,
        render: (o) => <Typography.Text>{o ? stripHtml(o) : '—'}</Typography.Text>,
        ...useColumnSearchProps(),
      },
      {
        key: 'actions',
        dataIndex: 'Id',
        align: 'center',
        fixed: 'right',
        render: (o) => (
          <Tooltip title={t('common:actions.edit')}>
            <Typography.Link onClick={() => onSelect(o)}>
              <Edit size={15} />
            </Typography.Link>
          </Tooltip>
        ),
        width: 70,
      },
    ],
    [onSelect],
  );

  return columns;
};
