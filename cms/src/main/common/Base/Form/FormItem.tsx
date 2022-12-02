import { Form } from 'antd';
import React from 'react';

type Props = React.ComponentProps<typeof Form.Item> & {
  direction?: 'horizontal' | 'vertical';
};

export default function FormItem(props: Props) {
  const { direction = 'vertical', ...otherProps } = props;

  return direction === 'vertical' ? (
    <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} {...otherProps} />
  ) : (
    <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} {...otherProps} />
  );
}
