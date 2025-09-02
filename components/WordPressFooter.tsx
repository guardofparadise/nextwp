'use client';

import { useEffect, useState } from 'react';
import Footer from './Footer';

interface FooterData {
  content: string;
  styles: string;
  hasContent: boolean;
}

export default function WordPressFooter() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wordpress/footer')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error && data.hasContent) {
          setFooterData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch WordPress footer:', err);
        setLoading(false);
      });
  }, []);

  // If WordPress footer content is available, use it
  if (footerData?.hasContent && footerData.content) {
    return (
      <>
        {footerData.styles && (
          <style dangerouslySetInnerHTML={{ __html: footerData.styles }} />
        )}
        <div 
          className="wordpress-footer"
          dangerouslySetInnerHTML={{ __html: footerData.content }}
        />
      </>
    );
  }

  // Otherwise, use the default Next.js footer
  return <Footer />;
}