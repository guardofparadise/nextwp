'use client';

import { useEffect } from 'react';
import GutenbergGallery from './GutenbergGallery';
import PageElementorStyles from './PageElementorStyles';

interface BlogPostContentProps {
  content: string;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  useEffect(() => {
    // Add Gutenberg block editor styles
    const gutenbergStyles = `
      /* Additional Gutenberg-specific styles for blog posts */
      .wp-block-gallery ul,
      .wp-block-gallery ol {
        list-style: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      
      .wp-block-gallery li {
        margin: 0 !important;
        padding: 0 !important;
      }

      /* Fix for gallery images in blog posts */
      .prose .wp-block-gallery {
        max-width: none;
      }

      .prose .wp-block-gallery img {
        margin: 0;
      }

      /* Ensure proper spacing for Gutenberg blocks */
      .wp-block-separator {
        border: none;
        border-top: 2px solid #e5e7eb;
        margin: 2rem auto;
        width: 100px;
      }

      .wp-block-quote {
        border-left: 4px solid #3b82f6;
        padding-left: 1rem;
        margin: 1.5rem 0;
        font-style: italic;
      }

      .wp-block-pullquote {
        border-top: 4px solid #3b82f6;
        border-bottom: 4px solid #3b82f6;
        padding: 1.5rem 0;
        margin: 2rem 0;
        text-align: center;
      }

      .wp-block-button {
        margin: 1rem 0;
      }

      .wp-block-button__link {
        background-color: #3b82f6;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.375rem;
        text-decoration: none;
        display: inline-block;
        transition: background-color 0.2s;
      }

      .wp-block-button__link:hover {
        background-color: #2563eb;
      }

      .wp-block-table {
        overflow-x: auto;
        margin: 1.5rem 0;
      }

      .wp-block-table table {
        min-width: 100%;
        border-collapse: collapse;
      }

      .wp-block-table td,
      .wp-block-table th {
        border: 1px solid #e5e7eb;
        padding: 0.5rem;
      }

      .wp-block-table th {
        background-color: #f9fafb;
        font-weight: 600;
      }

      /* Video embed responsiveness */
      .wp-block-embed {
        margin: 1.5rem 0;
      }

      .wp-block-embed__wrapper {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
      }

      .wp-block-embed__wrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      /* Code block styling */
      .wp-block-code {
        background-color: #1f2937;
        color: #f3f4f6;
        padding: 1rem;
        border-radius: 0.375rem;
        overflow-x: auto;
        margin: 1rem 0;
      }

      .wp-block-code code {
        font-family: 'Courier New', monospace;
        font-size: 0.875rem;
      }

      /* Preformatted text */
      .wp-block-preformatted {
        background-color: #f9fafb;
        padding: 1rem;
        border-radius: 0.375rem;
        overflow-x: auto;
        margin: 1rem 0;
      }

      /* Cover block */
      .wp-block-cover {
        position: relative;
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        margin: 2rem 0;
        overflow: hidden;
      }

      .wp-block-cover__inner-container {
        position: relative;
        z-index: 1;
        color: white;
        text-align: center;
      }

      .wp-block-cover img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .wp-block-cover__gradient-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.id = 'gutenberg-post-styles';
    styleElement.innerHTML = gutenbergStyles;
    document.head.appendChild(styleElement);

    return () => {
      const element = document.getElementById('gutenberg-post-styles');
      if (element) {
        element.remove();
      }
    };
  }, []);

  return (
    <>
      <PageElementorStyles content={content} />
      <GutenbergGallery />
      <div 
        className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic gutenberg-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
}