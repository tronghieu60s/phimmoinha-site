import { DatePicker, Input, TimePicker } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { t } from 'i18next';
import ImageResize from 'quill-image-resize-module-react';
import React from 'react';
import ReactQuill, { Quill } from 'react-quill';

Quill.register('modules/imageResize', ImageResize);
Quill.register(Quill.import('attributors/style/direction'), true);
Quill.register(Quill.import('attributors/style/align'), true);

export const FormInputEditorContainer = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ header: '1' }, { header: '2' }],
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ color: [] }, { background: [] }],
  ['link', 'image', 'video'],
  ['clean'],
];

export function FormInputText(props: React.ComponentProps<typeof Input>) {
  return <Input placeholder={t('common:input.placeholder')} {...props} />;
}

export function FormInputTextarea(props: React.ComponentProps<typeof TextArea>) {
  return <TextArea rows={5} placeholder={t('common:input.placeholder')} {...props} />;
}

export function FormInputNumber(props: React.ComponentProps<typeof Input>) {
  return <Input type="number" {...props} />;
}

export function FormInputColor(props: React.ComponentProps<typeof Input>) {
  return <Input type="color" {...props} />;
}

export function FormInputPassword(props: React.ComponentProps<typeof Input.Password>) {
  return <Input.Password showCount placeholder={t('common:input.placeholder')} {...props} />;
}

export function FormInputEditor(props: React.ComponentProps<typeof ReactQuill>) {
  return (
    <ReactQuill
      theme="snow"
      placeholder={t('common:input.editor.placeholder')}
      modules={{
        toolbar: { container: FormInputEditorContainer },
        imageResize: { parchment: Quill.import('parchment') },
      }}
      className="h-editor-100"
      {...props}
    />
  );
}

export function FormInputTimePicker(props: React.ComponentProps<typeof TimePicker>) {
  return <TimePicker placeholder={t('common:input.time.picker.placeholder')} {...props} />;
}

export function FormInputDatePicker(props: React.ComponentProps<typeof DatePicker>) {
  const { picker = 'date' } = props;
  return <DatePicker placeholder={t(`common:input.${picker}.picker.placeholder`)} {...props} />;
}
