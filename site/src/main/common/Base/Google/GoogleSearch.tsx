import React, { useEffect } from 'react';

const APP_GOOGLE_SEARCH_ID = process.env.NEXT_PUBLIC_APP_GOOGLE_SEARCH_ID || '';

export default function GoogleSearch() {
  useEffect(() => {
    const googleScript = document.createElement('script');
    googleScript.async = true;
    googleScript.src = `https://cse.google.com/cse.js?cx=${APP_GOOGLE_SEARCH_ID}`;
    document.body.appendChild(googleScript);
  }, []);

  return <div className="gcse-search" />;
}
