'use client';

import { useEffect, useState } from 'react';
import Header from './Header';

interface HeaderData {
  content: string;
  styles: string;
  hasContent: boolean;
}

export default function WordPressHeader() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wordpress/header')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error && data.hasContent) {
          setHeaderData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch WordPress header:', err);
        setLoading(false);
      });
  }, []);

  // If WordPress header content is available, use it
  if (headerData?.hasContent && headerData.content) {
    return (
      <>
        {headerData.styles && (
          <style dangerouslySetInnerHTML={{ __html: headerData.styles }} />
        )}
        <div 
          className="wordpress-header"
          dangerouslySetInnerHTML={{ __html: headerData.content }}
        />
      </>
    );
  }

  // Otherwise, use the default Next.js header
  return <Header />;
}