import { Card, Result } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Text from 'antd/lib/typography/Text';
import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export default function ResultError({ error }: FallbackProps) {
  return (
    <Card bordered={false}>
      <Result
        status="error"
        title="Something went wrong."
        subTitle="Please check below information and try again issue."
      >
        <Paragraph>
          <Text strong>{error.message}</Text>
        </Paragraph>
        <Paragraph className="mb-0">{error.stack}</Paragraph>
      </Result>
    </Card>
  );
}
