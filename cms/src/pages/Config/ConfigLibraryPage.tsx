import LibrariesForm from '@containers/Libraries/LibrariesForm';
import LibrariesList from '@containers/Libraries/LibrariesList';
import useQuery from '@hooks/useQuery';
import { Card, Col, Row, Skeleton } from 'antd';
import { t } from 'i18next';
import { Suspense, useMemo } from 'react';

export default function ConfigLibraryPage() {
  const query = useQuery();
  const page = useMemo(() => Number(query.get('page')), [query]);
  const page_size = useMemo(() => Number(query.get('page_size')), [query]);

  return (
    <Suspense fallback={<Skeleton active />}>
      <Row justify="space-between" gutter={20}>
        <Col span={16}>
          <Card title={t('site:title.config.library')} bordered={false}>
            <LibrariesList query={{ page, page_size }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <LibrariesForm />
          </Card>
        </Col>
      </Row>
    </Suspense>
  );
}
