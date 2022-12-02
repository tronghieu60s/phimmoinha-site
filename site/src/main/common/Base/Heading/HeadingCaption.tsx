import React from 'react';

export default function HeadingCaption(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
) {
  const { children, ...otherProps } = props;
  return (
    <h3 className="pm-main-heading-caption" {...otherProps}>
      {children}
    </h3>
  );
}
