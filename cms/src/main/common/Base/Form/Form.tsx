import { useValidateMessages } from '@hooks/useTableHooks';
import { Form as DefaultForm } from 'antd';
import React from 'react';

export default function Form(props: React.ComponentProps<typeof DefaultForm>) {
  return (
    <DefaultForm
      name="basic"
      autoComplete="off"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      validateMessages={useValidateMessages()}
      {...props}
    />
  );
}

Form.List = DefaultForm.List;
Form.useForm = DefaultForm.useForm;
