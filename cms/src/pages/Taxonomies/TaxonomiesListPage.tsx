import PageNotFound from '@common/Pages/PageNotFound';
import TermsForm from '@containers/Taxonomies/TaxonomiesForm';
import TermsList from '@containers/Taxonomies/TaxonomiesList';
import { queryParamsToObject } from '@core/commonFuncs';
import useQuery from '@hooks/useQuery';
import { TaxonomyMetaType } from '@service/taxonomy/taxonomy.types';
import { Card, Col, Row, Skeleton } from 'antd';
import { t } from 'i18next';
import { Suspense, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const types = ['Cast', 'Director', 'Country', 'Post_Category', 'Movie_Category', 'Tag'];

export default function TaxonomiesListPage() {
  const query = useQuery();
  const { search: queryParams } = useLocation();
  const objectQueryParams = useMemo(() => queryParamsToObject(queryParams), [queryParams]);

  const page = useMemo(() => Number(query.get('page')), [query]);
  const page_size = useMemo(() => Number(query.get('page_size')), [query]);

  const type = objectQueryParams.type as TaxonomyMetaType;
  if (types.indexOf(type) === -1) {
    return <PageNotFound />;
  }

  return (
    <Suspense fallback={<Skeleton active />}>
      <Row justify="space-between" gutter={20}>
        <Col span={16}>
          <Card title={t(`site:title.terms.${type.toLowerCase()}.list`)} bordered={false}>
            <TermsList query={{ page, page_size, type }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <TermsForm query={{ type }} />
          </Card>
        </Col>
      </Row>
    </Suspense>
  );
}
