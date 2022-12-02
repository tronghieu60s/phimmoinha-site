/* eslint-disable no-template-curly-in-string */
import {
  Button,
  Checkbox,
  CheckboxOptionType,
  DatePicker,
  Divider,
  Empty,
  Input,
  InputProps,
  Row,
  Slider,
  Space,
  Typography,
} from 'antd';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { t } from 'i18next';
import moment from 'moment';
import { Filter, Search } from 'react-feather';

export const useLocaleMessages = () => ({
  // filterTitle: 'Filter menu',
  filterConfirm: t('common:table.filter.confirm'),
  filterReset: t('common:table.filter.reset'),
  // filterEmptyText: 'No filters',
  // filterCheckall: 'Select all items',
  // filterSearchPlaceholder: 'Search in filters',
  emptyText: (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('common:table.empty.text')} />
  ),
  // selectAll: 'Select current page',
  // selectInvert: 'Invert current page',
  // selectNone: 'Clear all data',
  // selectionAll: 'Select all data',
  // sortTitle: 'Sort',
  // expand: 'Expand row',
  // collapse: 'Collapse row',
  triggerDesc: t('common:table.filter.triggerDesc'),
  triggerAsc: t('common:table.filter.triggerAsc'),
  cancelSort: t('common:table.filter.cancelSort'),
});

export const useValidateMessages = () => ({
  required: t('common:validate.required'),
  whitespace: t('common:validate.whitespace'),
  types: {
    email: t('common:validate.types.email'),
  },
  string: {
    min: t('common:validate.string.min', { min: '${min}' }),
    max: t('common:validate.string.max', { max: '${max}' }),
    range: t('common:validate.string.range', { min: '${min}', max: '${max}' }),
  },
  pattern: {
    mismatch: t('common:validate.types.pattern', { pattern: '${pattern}' }),
  },
});

type ColumnSearchProps = {
  type?: InputProps['type'];
  rangeNumberMin?: number;
  rangeNumberMax?: number;
  rangeNumberTextMin?: string;
  rangeNumberTextMax?: string;
  rangeNumberProps?: any;
  selectOptions?: (string | number | CheckboxOptionType)[];
  selectDirection?: 'horizontal' | 'vertical';
};

export const useColumnSearchProps = (props?: ColumnSearchProps) => {
  const {
    type = 'text',
    rangeNumberMin,
    rangeNumberMax,
    rangeNumberTextMin,
    rangeNumberTextMax,
    rangeNumberProps,
    selectOptions = [],
    selectDirection = 'horizontal',
  } = props || {};

  return {
    filterDropdown: ({ selectedKeys, setSelectedKeys, confirm }: FilterDropdownProps) => (
      <>
        <div style={{ padding: '9px 12px' }}>
          {(() => {
            if (type === 'select') {
              return (
                <Checkbox.Group
                  options={selectOptions}
                  value={selectedKeys}
                  onChange={(e) => setSelectedKeys((e as any) || [])}
                  className={`ant-checkbox-group-${selectDirection}`}
                />
              );
            }
            if (type === 'range-date') {
              return (
                <DatePicker.RangePicker
                  autoFocus
                  value={[
                    selectedKeys?.[0] ? moment(selectedKeys[0], 'YYYY-MM-DD') : null,
                    selectedKeys?.[1] ? moment(selectedKeys[1], 'YYYY-MM-DD') : null,
                  ]}
                  onChange={(e) => setSelectedKeys((e as any) || [])}
                />
              );
            }
            if (type === 'range-number') {
              return (
                <>
                  <Slider
                    range
                    min={rangeNumberMin}
                    max={rangeNumberMax}
                    step={10}
                    value={[
                      Number(selectedKeys?.[0] || rangeNumberMin),
                      Number(selectedKeys?.[1] || rangeNumberMax),
                    ]}
                    onChange={(e) => setSelectedKeys((e as any) || [])}
                    style={{ width: 250 }}
                    {...(rangeNumberProps || {})}
                  />
                  {(rangeNumberTextMin || rangeNumberTextMax) && (
                    <Row justify="space-between">
                      <Typography.Text strong>{rangeNumberTextMin}</Typography.Text>
                      <Typography.Text strong>{rangeNumberTextMax}</Typography.Text>
                    </Row>
                  )}
                </>
              );
            }
            return (
              <Input
                type={type}
                autoFocus
                value={selectedKeys[0]}
                onKeyUp={(e) => e.key === 'Enter' && confirm()}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                placeholder={t('common:input.search.placeholder')}
                style={{ width: 250 }}
              />
            );
          })()}
        </div>
        <Divider className="m-0" />
        <Space
          style={{
            width: '100%',
            justifyContent: 'space-between',
            padding: '7px 8px',
          }}
        >
          <Button
            type="link"
            size="small"
            onClick={() => {
              setSelectedKeys([]);
              confirm();
            }}
            disabled={!selectedKeys.length}
          >
            {t('common:actions.reset')}
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<Search size={12} className="mr-2" />}
            onClick={() => confirm()}
          >
            {t('common:input.search.button')}
          </Button>
        </Space>
      </>
    ),
    filterIcon: (filtered: boolean) => {
      if (type === 'select') {
        return <Filter size={13} style={{ color: filtered ? '#1890ff' : undefined }} />;
      }
      return <Search size={13} style={{ color: filtered ? '#1890ff' : undefined }} />;
    },
  };
};

export default {
  useValidateMessages,
  useColumnSearchProps,
};
