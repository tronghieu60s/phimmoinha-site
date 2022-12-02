import React from 'react';

export default function Heading(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
) {
  const { children, ...otherProps } = props;
  return (
    <h2 className="pm-main-heading" {...otherProps}>
      {children}
    </h2>
  );
}
