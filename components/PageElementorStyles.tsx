'use client';

import { useEffect } from 'react';

interface PageElementorStylesProps {
  content: string;
}

export default function PageElementorStyles({ content }: PageElementorStylesProps) {
  useEffect(() => {
    // Extract and inject page-specific Elementor styles from the content
    if (content) {
      // Extract inline styles from the content
      const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
      const styles: string[] = [];
      let match;
      
      while ((match = styleRegex.exec(content)) !== null) {
        if (match[1]) {
          styles.push(match[1]);
        }
      }

      if (styles.length > 0) {
        const styleElement = document.createElement('style');
        styleElement.id = 'page-elementor-styles';
        styleElement.innerHTML = styles.join('\n');
        document.head.appendChild(styleElement);

        return () => {
          const element = document.getElementById('page-elementor-styles');
          if (element) {
            element.remove();
          }
        };
      }
    }
  }, [content]);

  // Also ensure Elementor container classes work properly
  useEffect(() => {
    const additionalStyles = `
      /* Additional Elementor compatibility styles */
      .elementor-content .elementor {
        display: block;
      }
      .elementor-content .elementor-inner {
        display: block;
      }
      .elementor-content .elementor-section-wrap {
        display: block;
      }
      .elementor-content img {
        max-width: 100%;
        height: auto;
      }
      .elementor-content .wp-block-image {
        margin: 0;
      }
      /* Preserve Elementor animations */
      .elementor-invisible {
        visibility: hidden;
      }
      .animated {
        animation-duration: 1s;
        animation-fill-mode: both;
      }
      .fadeIn {
        animation-name: fadeIn;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.id = 'elementor-compat-styles';
    styleElement.innerHTML = additionalStyles;
    document.head.appendChild(styleElement);

    return () => {
      const element = document.getElementById('elementor-compat-styles');
      if (element) {
        element.remove();
      }
    };
  }, []);

  return null;
}