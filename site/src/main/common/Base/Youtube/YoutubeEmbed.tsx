import React from 'react';

type Props = React.ComponentProps<'iframe'> & {
  id: string;
  title?: string;
};

export default function YoutubeEmbed(props: Props) {
  const { id, title, ...otherProps } = props;

  return (
    <iframe
      src={`https://www.youtube.com/embed/${id}`}
      title={title}
      width="100%"
      height="100%"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      {...otherProps}
    />
  );
}
