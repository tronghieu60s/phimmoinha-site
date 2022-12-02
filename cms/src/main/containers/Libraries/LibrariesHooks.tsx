import { useColumnSearchProps } from '@hooks/useTableHooks';
import { LibraryType } from '@service/library/library.types';
import { Popconfirm, Tag, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { t } from 'i18next';
import { useMemo } from 'react';
import { Trash } from 'react-feather';

export type FormType = {
  Type: string;
  Key: string;
  Value: string;
  Color: string;
  ColorHex: string;
};

export const initialValues: FormType = {
  Type: '',
  Key: '',
  Value: '',
  Color: 'blue',
  ColorHex: '',
};

export const useFormValues = async (values: FormType) => {
  const { Type, Key, Value, Color } = values;

  return {
    Type,
    Key,
    Value,
    Color,
  };
};

export const useCurrentValues = (library: LibraryType) => {
  const { Id, Type, Key, Value, Color } = library;

  return {
    Id,
    Type,
    Key,
    Value,
    Color,
    ColorHex: Color,
  };
};

type Props = {
  onDeleteItem: (id: number) => void;
};

export const useColumns = (props: Props): ColumnsType<object> => {
  const { onDeleteItem } = props;

  const columns: ColumnsType<object> = useMemo(
    () => [
      {
        key: 'Type',
        title: t('libraries:data.type'),
        dataIndex: 'Type',
        width: '20%',
        sorter: true,
        ...useColumnSearchProps(),
      },
      {
        key: 'Key',
        title: t('libraries:data.key'),
        dataIndex: 'Key',
        width: '20%',
        sorter: true,
        ...useColumnSearchProps(),
      },
      {
        key: 'Value',
        title: t('libraries:data.value'),
        dataIndex: 'Value',
        render: (o) => o || '—',
        width: '25%',
        sorter: true,
        ...useColumnSearchProps(),
      },
      {
        key: 'Color',
        title: t('libraries:data.color'),
        dataIndex: 'Color',
        render: (o) => <Tag color={o || ''}>{o || '—'}</Tag>,
        width: '25%',
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
