import React from 'react';

type Props = React.ComponentProps<'div'> & {
  title?: string;
};

const Section = React.forwardRef((props: Props, ref: React.LegacyRef<HTMLDivElement>) => {
  const { title, children, ...otherProps } = props;

  return (
    <div ref={ref} className="pm-main-section" {...otherProps}>
      {title && <h2 className="pm-main-section-title">{title}</h2>}
      {children}
    </div>
  );
});

export default Section;
