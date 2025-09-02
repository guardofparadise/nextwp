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

  useEffect(() => {
    fetch('/api/wordpress/header')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error && data.hasContent) {
          setHeaderData(data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch WordPress header:', err);
      });
  }, []);

  // If WordPress header content is available, use it
  if (headerData?.hasContent && headerData.content) {
    // Process the HTML to replace WordPress URLs with local routes
    let processedContent = headerData.content;
    
    // Replace WordPress home URL with local root
    processedContent = processedContent.replace(
      /https:\/\/vladclaudecode\.wpenginepowered\.com\/?"/g, 
      '/"'
    );
    processedContent = processedContent.replace(
      /http:\/\/vladclaudecode\.wpenginepowered\.com\/?"/g, 
      '/"'
    );
    
    // Map specific WordPress pages to local routes
    processedContent = processedContent.replace(
      /https:\/\/vladclaudecode\.wpenginepowered\.com\/our-team\/?"/g, 
      '/about"'
    );
    processedContent = processedContent.replace(
      /http:\/\/vladclaudecode\.wpenginepowered\.com\/our-team\/?"/g, 
      '/about"'
    );
    
    processedContent = processedContent.replace(
      /https:\/\/vladclaudecode\.wpenginepowered\.com\/contact-us\/?"/g, 
      '/contact"'
    );
    processedContent = processedContent.replace(
      /http:\/\/vladclaudecode\.wpenginepowered\.com\/contact-us\/?"/g, 
      '/contact"'
    );
    
    // Map our-menu to blog (or remove if not needed)
    processedContent = processedContent.replace(
      /https:\/\/vladclaudecode\.wpenginepowered\.com\/our-menu\/?"/g, 
      '/blog"'
    );
    processedContent = processedContent.replace(
      /http:\/\/vladclaudecode\.wpenginepowered\.com\/our-menu\/?"/g, 
      '/blog"'
    );

    return (
      <>
        {headerData.styles && (
          <style dangerouslySetInnerHTML={{ __html: headerData.styles }} />
        )}
        <div 
          className="wordpress-header"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </>
    );
  }

  // Otherwise, use the default Next.js header
  return <Header />;
}