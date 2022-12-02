import React from 'react';

export default function Alert(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) {
  return <div className="pm-main-alert" {...props} />;
}
