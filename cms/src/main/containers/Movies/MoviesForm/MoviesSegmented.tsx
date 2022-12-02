import { Segmented, Space } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import { t } from 'i18next';
import React from 'react';
import { Archive, Film, Shield, Square } from 'react-feather';

type Props = {
  value: string | number;
  onChange: (value: SegmentedValue) => void;
};

export default function MoviesSegmented(props: Props) {
  const { value, onChange } = props;

  return (
    <Segmented
      options={[
        {
          label: (
            <Space align="center" className="px-4">
              <Square size={15} className="mt-2" />
              <span className="text-capitalize">{t('movies:tab.info.main')}</span>
            </Space>
          ),
          value: 'main',
        },
        {
          label: (
            <Space align="center" className="px-4">
              <Archive size={15} className="mt-2" />
              <span className="text-capitalize">{t('movies:tab.info.film')}</span>
            </Space>
          ),
          value: 'film',
        },
        {
          label: (
            <Space align="center" className="px-4">
              <Film size={15} className="mt-2" />
              <span className="text-capitalize">{t('movies:tab.info.eps')}</span>
            </Space>
          ),
          value: 'episodes',
        },
        {
          label: (
            <Space align="center" className="px-4">
              <Shield size={15} className="mt-2" />
              <span className="text-capitalize">{t('movies:tab.info.seo')}</span>
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
