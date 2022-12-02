import { Card, Result } from 'antd';

export default function ResultMaintain() {
  return (
    <Card bordered={false}>
      <Result
        status="info"
        title="Maintenance"
        subTitle="We are doing system maintenance. Please come back later."
      />
    </Card>
  );
}
