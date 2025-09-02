'use client';

import { useEffect, useState } from 'react';

interface ElementorStylesData {
  styles: string;
  stylesheets: string[];
  elementorConfig: any;
  rootVars: string;
  customCss: string;
  elementorBase: string;
}

export default function ElementorStyles() {
  const [styles, setStyles] = useState<ElementorStylesData | null>(null);

  useEffect(() => {
    // Fetch Elementor styles
    fetch('/api/wordpress/styles')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStyles(data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch Elementor styles:', err);
      });
  }, []);

  useEffect(() => {
    if (styles) {
      // Inject inline styles
      if (styles.styles || styles.customCss || styles.elementorBase || styles.rootVars) {
        const styleElement = document.createElement('style');
        styleElement.id = 'elementor-styles';
        styleElement.innerHTML = `
          ${styles.rootVars ? `:root { ${styles.rootVars} }` : ''}
          ${styles.elementorBase || ''}
          ${styles.styles || ''}
          ${styles.customCss || ''}
        `;
        document.head.appendChild(styleElement);

        return () => {
          const element = document.getElementById('elementor-styles');
          if (element) {
            element.remove();
          }
        };
      }
    }
  }, [styles]);

  // Load external stylesheets
  useEffect(() => {
    if (styles?.stylesheets && styles.stylesheets.length > 0) {
      const links: HTMLLinkElement[] = [];
      
      styles.stylesheets.forEach((href, index) => {
        // Only load Elementor-specific stylesheets
        if (href.includes('elementor')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.id = `elementor-stylesheet-${index}`;
          document.head.appendChild(link);
          links.push(link);
        }
      });

      return () => {
        links.forEach(link => link.remove());
      };
    }
  }, [styles?.stylesheets]);

  return null;
}