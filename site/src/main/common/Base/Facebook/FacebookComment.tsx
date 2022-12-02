import { DetailedHTMLProps, HTMLAttributes, useEffect } from 'react';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  href?: string;
  width?: number;
  colorscheme?: 'light' | 'dark';
  numPosts?: number;
  orderBy?: 'time' | 'reverse_time';
};

const APP_FACEBOOK_ID = process.env.NEXT_PUBLIC_APP_FACEBOOK_ID || '';
const APP_FACEBOOK_HREF = process.env.NEXT_PUBLIC_APP_FACEBOOK_HREF || '';

export default function FacebookComment(props: Props) {
  const {
    href = '/',
    width = '100%',
    colorscheme = 'light',
    numPosts = 10,
    orderBy = 'reverse_time',
    style,
    ...restProps
  } = props;

  useEffect(() => {
    if ((window as any).FB) {
      (window as any).FB.XFBML.parse();
    }
  }, []);

  useEffect(() => {
    const facebookScript = document.createElement('script');
    facebookScript.async = true;
    facebookScript.src = `https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v14.0&appId=${APP_FACEBOOK_ID}&autoLogAppEvents=1`;
    document.body.appendChild(facebookScript);
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', ...style }} {...restProps}>
      <div id="fb-root" />
      <div
        className="fb-comments"
        data-href={`${APP_FACEBOOK_HREF}${href}`}
        data-width={width}
        data-colorscheme={colorscheme}
        data-numposts={numPosts}
        data-order-by={orderBy}
      />
    </div>
  );
}
