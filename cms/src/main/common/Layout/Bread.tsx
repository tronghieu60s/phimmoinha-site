import { Breadcrumb } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  breadcrumb: { title: React.ReactNode; path: string }[];
};

export default function Bread(props: Props) {
  const { breadcrumb } = props;

  return (
    <Breadcrumb style={{ margin: '16px 0' }}>
      {breadcrumb.map((item) => (
        <Breadcrumb.Item key={uuidv4()}>
          <div className="d-inline-flex align-center">
            <Link to={item.path}>{item.title}</Link>
          </div>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
