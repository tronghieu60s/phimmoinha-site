import UploadControl from '@common/Base/Upload/UploadControl';
import { Modal, Skeleton } from 'antd';
import { t } from 'i18next';
import React, { Suspense, useCallback } from 'react';

type Props = React.ComponentProps<typeof Modal> & {
  folder: string;
  accept?: string;
  maxFiles?: number;
  setVisible: (visible: boolean) => void;
  onSelectItemValue: (uploads: string[]) => void;
};

export default function UploadModal(props: Props) {
  const { folder, accept, maxFiles, setVisible, onSelectItemValue, ...otherProps } = props;

  const onHandleSelectUpload = useCallback(
    (uploads: string[]) => {
      setVisible(false);
      onSelectItemValue(uploads);
    },
    [setVisible, onSelectItemValue],
  );

  return (
    <Modal
      footer={null}
      title={t('uploads:data.title')}
      className="ant-upload-modal"
      onCancel={() => setVisible(false)}
      {...otherProps}
    >
      <Suspense fallback={<Skeleton active />}>
        <UploadControl
          folder={folder}
          accept={accept}
          maxSelect={maxFiles}
          onSelectItemValue={onHandleSelectUpload}
        />
      </Suspense>
    </Modal>
  );
}
