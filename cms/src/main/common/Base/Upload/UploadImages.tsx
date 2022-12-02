import { Button, FormInstance, Upload } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'react-feather';
import UploadModal from './UploadModal';

type Props = {
  form: FormInstance;
  nameField?: string | string[];
  maxFiles?: number;
};

export default function UploadImages(props: React.ComponentProps<typeof Upload> & Props) {
  const { name, nameField = name || '', form, maxFiles = 1 } = props;

  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(Math.random());

  useEffect(() => {
    if (!nameField) {
      throw new Error('nameField is required');
    }
  }, [nameField]);

  useEffect(() => {
    if (maxFiles < 1) {
      throw new Error('maxFiles must be greater than 0');
    }
    setRefresh(Math.random());
  }, [maxFiles]);

  const fileList = useMemo(
    (): UploadFile[] =>
      form
        .getFieldValue(nameField)
        ?.fileList?.filter((f: any) => f)
        .map((f: any) => {
          if (typeof f === 'string') {
            return { uid: f, name: f, status: 'done', url: f };
          }
          return f;
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, nameField, refresh],
  );

  const onRemove = useCallback(
    (file: UploadFile) => {
      if (nameField instanceof Array) {
        form.setFieldsValue({
          [nameField[0]]: {
            ...form.getFieldValue(nameField[0]),
            [nameField[1]]: {
              ...form.getFieldValue(nameField[1]),
              fileList: fileList.filter((f: any) => f.uid !== file.uid),
            },
          },
        });
      } else {
        form.setFieldsValue({
          [nameField]: {
            ...form.getFieldValue(nameField),
            fileList: fileList.filter((f: any) => f.uid !== file.uid),
          },
        });
      }
      setRefresh(Math.random());
    },
    [fileList, form, nameField],
  );

  const onSelectItemValue = useCallback(
    (uploads: string[]) => {
      if (nameField instanceof Array) {
        form.setFieldsValue({
          [nameField[0]]: {
            ...form.getFieldValue(nameField[0]),
            [nameField[1]]: {
              ...form.getFieldValue(nameField[1]),
              fileList: uploads,
            },
          },
        });
      } else {
        form.setFieldsValue({
          [nameField]: { ...form.getFieldValue(nameField), fileList: uploads },
        });
      }
      setRefresh(Math.random());
    },
    [form, nameField],
  );

  return (
    <>
      <Upload
        accept="image/*"
        listType="picture-card"
        fileList={fileList}
        onRemove={onRemove}
        openFileDialogOnClick={false}
        beforeUpload={() => false}
        {...props}
      >
        {fileList.length >= maxFiles ? null : (
          <Button type="text" className="ant-upload-wrapper" onClick={() => setVisible(true)}>
            <Plus />
            <div className="mt-2">Upload</div>
          </Button>
        )}
      </Upload>
      <UploadModal
        folder="images"
        accept="image/*"
        visible={visible}
        setVisible={setVisible}
        maxFiles={maxFiles}
        onSelectItemValue={onSelectItemValue}
      />
    </>
  );
}
