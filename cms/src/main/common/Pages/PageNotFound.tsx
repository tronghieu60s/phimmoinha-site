import ResultNotFound from '@common/Base/Result/ResultNotFound';
import { Card } from 'antd';
import React from 'react';

export default function PageNotFound() {
  return (
    <Card bordered={false}>
      <ResultNotFound />
    </Card>
  );
}
