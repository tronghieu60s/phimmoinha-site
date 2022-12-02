import React from 'react';

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  size?: 'small' | 'middle' | 'large' | number;
};

export default function Section(props: Props) {
  const { size = 'middle', ...otherProps } = props;
  if (typeof size === 'number') {
    return <div style={{ height: size }} {...otherProps} />;
  }
  return <div className={`section ${size}`} {...otherProps} />;
}
