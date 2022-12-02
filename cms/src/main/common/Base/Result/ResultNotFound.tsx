import { Card, Result } from 'antd';
import React from 'react';

export default function ResultNotFound() {
  return (
    <Card bordered={false}>
      <Result status="404" title="404" subTitle="Sorry, the page you visited does not exist." />
    </Card>
  );
}
