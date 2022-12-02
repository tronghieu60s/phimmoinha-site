import { FormInputEditor, FormInputText } from '@common/Base/Form/FormInput';
import FormItem from '@common/Base/Form/FormItem';
import { TIMEOUT_DEBOUNCE } from '@const/config';
import { stripHtml } from '@core/commonFuncs';
import { Col, FormInstance, Row } from 'antd';
import { t } from 'i18next';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type Props = {
  form: FormInstance<any>;
  errorTitle: string;
  errorSlug: string;
};

export default function PostsMain(props: Props) {
  const { form, errorTitle, errorSlug } = props;

  const [countContent, setCountContent] = useState(0);

  const onChangeContent = useDebouncedCallback(() => {
    const content = form.getFieldValue('Content');
    setCountContent(stripHtml(content).trim().split(' ').length);
  }, TIMEOUT_DEBOUNCE);

  return (
    <Row justify="start" className="px-2" gutter={40}>
      <Col span={24}>
        <FormItem
          name="Title"
          label={t('posts:form.input.title')}
          rules={[{ required: true }]}
          {...(errorTitle && {
            hasFeedback: true,
            help: errorTitle,
            validateStatus: 'warning',
          })}
        >
          <FormInputText />
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem
          name="Slug"
          label={t('posts:form.input.slug')}
          {...(errorSlug && {
            hasFeedback: true,
            help: errorSlug,
            validateStatus: 'warning',
          })}
        >
          <FormInputText />
        </FormItem>
      </Col>
      <Col span={24}>
        <FormItem name="Content" label={t('posts:form.input.content')}>
          <FormInputEditor className="h-editor-600" onChange={onChangeContent} />
        </FormItem>
        <Row justify="space-between">
          <pre>{t('posts:form.input.content.count', { count: countContent })}</pre>
        </Row>
      </Col>
    </Row>
  );
}
