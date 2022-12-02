import { Spin } from 'antd';
import React from 'react';

export default function PageLoading(props: React.ComponentProps<'div'>) {
  const { children } = props;
  return (
    <div className="d-flex justify-center align-center" style={{ width: '100%', height: '100vh' }}>
      <Spin size="default" />
      <p>{children}</p>
    </div>
  );
}
