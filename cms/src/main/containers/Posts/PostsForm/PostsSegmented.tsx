import { Segmented, Space } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import { t } from 'i18next';
import React from 'react';
import { Shield, Square } from 'react-feather';

type Props = {
  value: string | number;
  onChange: (value: SegmentedValue) => void;
};

export default function PostsSegmented(props: Props) {
  const { value, onChange } = props;

  return (
    <Segmented
      options={[
        {
          label: (
            <Space align="center" className="px-4">
              <Square size={15} className="mt-2" />
              <span className="text-capitalize">{t('posts:tab.info.main')}</span>
            </Space>
          ),
          value: 'main',
        },
        {
          label: (
            <Space align="center" className="px-4">
              <Shield size={15} className="mt-2" />
              <span className="text-capitalize">{t('posts:tab.info.seo')}</span>
            </Space>
          ),
          value: 'seo',
        },
      ]}
      value={value}
      onChange={onChange}
    />
  );
}
