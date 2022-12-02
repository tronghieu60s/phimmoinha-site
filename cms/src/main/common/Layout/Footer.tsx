import { Footer as DefaultFooter } from 'antd/lib/layout/layout';
import React from 'react';

const APP_DOCUMENT_COPYRIGHT = process.env.APP_DOCUMENT_COPYRIGHT || 'Ant Design © 2022.';

export default function Footer() {
  return <DefaultFooter style={{ textAlign: 'center' }}>{APP_DOCUMENT_COPYRIGHT}</DefaultFooter>;
}
