import { tableRangeState } from '@service/theme/theme.reducer';
import {
  Button,
  Dropdown,
  Menu,
  Row,
  Space,
  TablePaginationConfig,
  Tooltip,
  Typography,
} from 'antd';
import { t } from 'i18next';
import React from 'react';
import { Plus, RotateCcw, RotateCw, Sliders } from 'react-feather';
import { useSetRecoilState } from 'recoil';

const APP_LIMIT_PAGINATION = process.env.APP_LIMIT_PAGINATION || 25;

type Props = {
  addIcon?: React.ReactNode;
  addTitle?: string;
  pagination?: TablePaginationConfig;
  onAdd?: () => void;
  onReset?: () => void;
  onRefresh?: () => void;
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
  className?: string;
};

export default function TableActions(props: Props) {
  const {
    addIcon,
    addTitle,
    pagination,
    onAdd,
    onReset,
    onRefresh,
    leftChildren,
    rightChildren,
    className,
  } = props;

  const {
    total = 0,
    current: page = 1,
    pageSize = Number(APP_LIMIT_PAGINATION),
  } = pagination || {};

  const setTableRange = useSetRecoilState(tableRangeState);

  return (
    <Row justify="space-between" align="middle" className={className || 'mb-4'}>
      <Typography>
        {leftChildren}
        {total > 0 &&
          !leftChildren &&
          t('common:table.total', {
            start: (page - 1) * pageSize + 1,
            end: Math.min(page * pageSize, total),
            total,
          })}
      </Typography>
      <Space size={20}>
        {rightChildren}
        {onReset && (
          <Button icon={addIcon || <RotateCcw size={14} className="mr-2" />} onClick={onReset}>
            {addTitle || t('common:table.reset')}
          </Button>
        )}
        {onAdd && (
          <Button
            type="primary"
            icon={addIcon || <Plus size={14} className="mr-2" />}
            onClick={onAdd}
          >
            {addTitle || t('common:table.add')}
          </Button>
        )}
        {onRefresh && (
          <Tooltip title={t('common:table.reload')}>
            <div style={{ display: 'flex' }}>
              <RotateCw size={15} onClick={onRefresh} />
            </div>
          </Tooltip>
        )}
        <Tooltip title={t('common:table.range')}>
          <Dropdown
            overlay={
              <Menu onClick={(o: { key: any }) => setTableRange(o.key)}>
                <Menu.Item key="small">{t('common:table.range.small')}</Menu.Item>
                <Menu.Item key="middle" color="red">
                  {t('common:table.range.middle')}
                </Menu.Item>
                <Menu.Item key="large">{t('common:table.range.large')}</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <div style={{ display: 'flex' }}>
              <Sliders size={15} />
            </div>
          </Dropdown>
        </Tooltip>
      </Space>
    </Row>
  );
}
