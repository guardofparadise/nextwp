'use client';

import { useEffect, useState } from 'react';

interface ElementorStylesData {
  styles: string;
  stylesheets: string[];
  elementorConfig: Record<string, unknown> | null;
  rootVars: string;
  customCss: string;
  elementorBase: string;
}

export default function ElementorStyles() {
  const [styles, setStyles] = useState<ElementorStylesData | null>(null);

  useEffect(() => {
    // Fetch Elementor styles with priority
    const controller = new AbortController();
    
    fetch('/api/wordpress/styles', {
      signal: controller.signal,
      // Add high priority for faster loading
      headers: {
        'Priority': 'u=1, i'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStyles(data);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch Elementor styles:', err);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (styles) {
      // Inject inline styles with immediate application
      if (styles.styles || styles.customCss || styles.elementorBase || styles.rootVars) {
        // Remove any existing styles first to prevent conflicts
        const existingElement = document.getElementById('elementor-styles');
        if (existingElement) {
          existingElement.remove();
        }

        const styleElement = document.createElement('style');
        styleElement.id = 'elementor-styles';
        // Add critical loading styles to prevent flash
        styleElement.innerHTML = `
          /* Critical loading styles */
          .elementor-loading {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
          }
          .elementor-loaded {
            opacity: 1;
          }
          
          /* WordPress styles */
          ${styles.rootVars ? `:root { ${styles.rootVars} }` : ''}
          ${styles.elementorBase || ''}
          ${styles.styles || ''}
          ${styles.customCss || ''}
        `;
        
        // Insert at the beginning of head for higher priority
        document.head.insertBefore(styleElement, document.head.firstChild);
        
        // Mark styles as applied after a brief delay to ensure DOM is ready
        setTimeout(() => {
          // Remove loading class from body to show content
          document.body.classList.remove('elementor-loading');
          document.body.classList.add('elementor-loaded');
        }, 50);

        return () => {
          const element = document.getElementById('elementor-styles');
          if (element) {
            element.remove();
          }
        };
      }
    }
  }, [styles]);

  // Load external stylesheets with preload for faster loading
  useEffect(() => {
    if (styles?.stylesheets && styles.stylesheets.length > 0) {
      const links: HTMLLinkElement[] = [];
      let loadedCount = 0;
      
      styles.stylesheets.forEach((href, index) => {
        // Check if stylesheet is already loaded
        const existingLink = document.querySelector(`link[href="${href}"]`);
        if (existingLink) {
          loadedCount++;
          return;
        }

        // Preload first, then load as stylesheet
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'style';
        preloadLink.href = href;
        preloadLink.onload = () => {
          preloadLink.rel = 'stylesheet';
          loadedCount++;
          
          // When all external stylesheets are loaded, ensure smooth transition
          if (loadedCount === styles.stylesheets.length) {
            setTimeout(() => {
              document.body.classList.add('external-styles-loaded');
            }, 100);
          }
        };
        
        preloadLink.id = `wordpress-stylesheet-${index}`;
        document.head.appendChild(preloadLink);
        links.push(preloadLink);
      });

      return () => {
        links.forEach(link => link.remove());
      };
    }
  }, [styles?.stylesheets]);

  // Add initial loading state to body when component mounts
  useEffect(() => {
    document.body.classList.add('elementor-loading');
    
    return () => {
      document.body.classList.remove('elementor-loading', 'elementor-loaded', 'external-styles-loaded');
    };
  }, []);

  return null;
}