import PermissionsForm from '@containers/Permissions/PermissionsForm';
import PermissionsList from '@containers/Permissions/PermissionsList';
import useQuery from '@hooks/useQuery';
import { Card, Col, Row, Skeleton } from 'antd';
import { t } from 'i18next';
import { Suspense, useMemo } from 'react';

export default function PermissionsListPage() {
  const query = useQuery();
  const page = useMemo(() => Number(query.get('page')), [query]);
  const page_size = useMemo(() => Number(query.get('page_size')), [query]);

  return (
    <Suspense fallback={<Skeleton active />}>
      <Row justify="space-between" gutter={20}>
        <Col span={16}>
          <Card title={t('site:title.users.permission')} bordered={false}>
            <PermissionsList query={{ page, page_size }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <PermissionsForm />
          </Card>
        </Col>
      </Row>
    </Suspense>
  );
}
