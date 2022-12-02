import { FormInputDatePicker } from '@common/Base/Form/FormInput';
import FormItem from '@common/Base/Form/FormItem';
import { postStatusTextState } from '@service/post/post.reducer';
import { Button, Divider, Row, Select, Typography } from 'antd';
import { t } from 'i18next';
import { useRecoilValueLoadable } from 'recoil';

type Props = {
  loading: boolean;
  isCreate: boolean;
  isSchedule: boolean;
  onDraftFinish: () => void;
  onTrashFinish: () => void;
};

export default function PostsFormPost(props: Props) {
  const { loading, isCreate, isSchedule, onDraftFinish, onTrashFinish } = props;

  const { contents: postStatusText } = useRecoilValueLoadable(postStatusTextState);

  return (
    <>
      <FormItem
        name="Status"
        label={t('posts:form.input.status')}
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 12 }}
      >
        <Select>
          <Select.Option key="Draft">{postStatusText?.Draft?.Value}</Select.Option>
          {isSchedule ? (
            <Select.Option key="Published">{postStatusText?.Schedule?.Value}</Select.Option>
          ) : (
            <Select.Option key="Published">{postStatusText?.Published?.Value}</Select.Option>
          )}
        </Select>
      </FormItem>
      <FormItem name="DatePublish" label={t('posts:form.input.date')} direction="horizontal">
        <FormInputDatePicker showTime className="w-100" />
      </FormItem>
      <Divider className="my-3" />
      <Row justify="space-between">
        {isCreate && (
          <Button type="dashed" onClick={onDraftFinish}>
            {t('common:actions.draft')}
          </Button>
        )}
        <Button type="link" className="px-0">
          {!isCreate && (
            <Typography.Text type="danger" underline onClick={onTrashFinish}>
              {t('common:actions.save.trash')}
            </Typography.Text>
          )}
        </Button>
        <Button loading={loading} type="primary" htmlType="submit">
          {isCreate ? t('common:actions.save') : t('common:actions.update')}
        </Button>
      </Row>
    </>
  );
}
