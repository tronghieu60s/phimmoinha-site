import Plyr, { usePlyr } from 'plyr-react';
import React from 'react';

type Props = React.ComponentProps<'video'> & {
  source: Plyr.SourceInfo;
  options?: Plyr.Options;
};

const PlyrPlayer = React.forwardRef((props: Props, ref: React.Ref<any>) => {
  const { source, options = null, ...rest } = props;
  const videoRef = usePlyr(ref, { source, options });
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video ref={videoRef} className="plyr-react plyr" {...rest} />;
});

export default PlyrPlayer;
