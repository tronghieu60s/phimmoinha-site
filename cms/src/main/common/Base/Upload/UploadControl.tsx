import { UploadType } from '@const/types';
// import MediaForm from '@containers/Media/MediaForm';
// import MediaList from '@containers/Media/MediaList';
import useQuery from 'hooks/useQuery';
import { Button, Col, Row, Space } from 'antd';
import { t } from 'i18next';
import { useCallback, useMemo, useState } from 'react';

type Props = {
  folder: string;
  accept?: string;
  maxSelect?: number;
  onSelectItemValue: (uploads: string[]) => void;
};

export default function UploadControl(props: Props) {
  const { folder, accept, maxSelect = 1, onSelectItemValue } = props;

  const query = useQuery();
  const page = useMemo(() => Number(query.get('page')), [query]);
  const page_size = useMemo(() => Number(query.get('page_size')), [query]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const onSelectItem = useCallback(
    (o: string[]) => {
      setSelectedRowKeys([]);
      onSelectItemValue(o);
    },
    [onSelectItemValue],
  );

  const selectedOutRange = useMemo(
    () => selectedRowKeys.length >= maxSelect,
    [maxSelect, selectedRowKeys.length],
  );

  const maxHeightTable = useMemo(() => {
    if (selectedRowKeys.length > 0) {
      if (maxSelect > 1) {
        return 'calc(100vh - 360px)';
      }
      return 'calc(100vh - 350px)';
    }
    return 'calc(100vh - 300px)';
  }, [maxSelect, selectedRowKeys.length]);

  return (
    <Row gutter={40}>
      <Col span={6}>
        <Space direction="vertical">{/* <MediaForm query={{ folder }} accept={accept} /> */}</Space>
      </Col>
      <Col span={18} className="mb-4">
        {/* <MediaList
          query={{ folder, page, page_size }}
          breadcrumb={false}
          // rowKey={(o) => (o as any).upload_path}
          scroll={{ x: 900, y: maxHeightTable }}
          onSelected={(o: string[]) => setSelectedRowKeys(o)}
          onSelectItem={onSelectItem}
          pagination={{ showQuickJumper: false }}
          rowSelection={{
            getCheckboxProps: (r: UploadType) => ({
              disabled:
                selectedOutRange && selectedRowKeys.find((o) => o === r.upload_path) === undefined,
            }),
          }}
          rightChildren={
            selectedRowKeys.length > 0 && (
              <Button type="link" onClick={() => onSelectItem(selectedRowKeys)}>
                {t('common:selected.future.range', {
                  num: selectedRowKeys.length,
                  range: maxSelect,
                })}
              </Button>
            )
          }
        /> */}
      </Col>
    </Row>
  );
}
