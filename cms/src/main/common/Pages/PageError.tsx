import ResultError from '@common/Base/Result/ResultError';
import { Card } from 'antd';
import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export default function PageError(props: FallbackProps) {
  return (
    <Card bordered={false}>
      <ResultError {...props} />
    </Card>
  );
}
