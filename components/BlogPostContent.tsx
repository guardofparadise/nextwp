'use client';

import { useEffect } from 'react';
import { Tweet } from 'react-tweet';
import GutenbergGallery from './GutenbergGallery';
import PageElementorStyles from './PageElementorStyles';

interface BlogPostContentProps {
  content: string;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  useEffect(() => {
    // Add comprehensive Gutenberg block styles
    const gutenbergStyles = `
      /* Reset and base styles for WordPress blocks */
      .gutenberg-content .wp-block-image,
      .gutenberg-content .wp-block-gallery,
      .gutenberg-content .wp-block-columns,
      .gutenberg-content .wp-block-group {
        margin: 1.5rem 0;
      }

      /* Image alignment classes */
      .gutenberg-content .alignfull {
        width: 100vw;
        max-width: 100vw;
        margin-left: calc(50% - 50vw);
        margin-right: calc(50% - 50vw);
      }

      .gutenberg-content .alignwide {
        width: 100%;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
      }

      .gutenberg-content .aligncenter {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        display: block;
      }

      .gutenberg-content .alignleft {
        float: left;
        margin-right: 1rem;
        margin-bottom: 1rem;
      }

      .gutenberg-content .alignright {
        float: right;
        margin-left: 1rem;
        margin-bottom: 1rem;
      }

      /* Figure and image blocks */
      .gutenberg-content figure {
        margin: 1.5rem 0;
      }

      .gutenberg-content figure img {
        display: block;
        max-width: 100%;
        height: auto;
        border-radius: 0.375rem;
      }

      .gutenberg-content figcaption {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
        text-align: center;
        font-style: italic;
      }

      /* Gallery blocks */
      .gutenberg-content .wp-block-gallery {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 2rem 0;
        list-style: none !important;
        padding: 0 !important;
      }

      .gutenberg-content .wp-block-gallery .wp-block-image,
      .gutenberg-content .wp-block-gallery li {
        flex: 1;
        min-width: 200px;
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
      }

      .gutenberg-content .wp-block-gallery img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .gutenberg-content .wp-block-gallery img:hover {
        transform: scale(1.02);
      }

      /* Columns layout */
      .gutenberg-content .wp-block-columns {
        display: flex;
        gap: 2rem;
        margin: 2rem 0;
        flex-wrap: wrap;
      }

      .gutenberg-content .wp-block-column {
        flex: 1;
        min-width: 250px;
      }

      /* Mobile responsive columns */
      @media (max-width: 768px) {
        .gutenberg-content .wp-block-columns {
          flex-direction: column;
          gap: 1rem;
        }
        
        .gutenberg-content .wp-block-column {
          min-width: 100%;
        }
      }

      /* Quote blocks */
      .gutenberg-content .wp-block-quote,
      .gutenberg-content blockquote {
        border-left: 4px solid #3b82f6;
        padding-left: 1.5rem;
        margin: 2rem 0;
        font-style: italic;
        background-color: #f8fafc;
        padding: 1.5rem;
        border-radius: 0.375rem;
      }

      .gutenberg-content .wp-block-pullquote {
        border: 4px solid #3b82f6;
        padding: 2rem;
        margin: 2rem 0;
        text-align: center;
        font-size: 1.25rem;
        border-radius: 0.5rem;
      }

      .gutenberg-content .wp-block-quote cite,
      .gutenberg-content .wp-block-pullquote cite {
        display: block;
        margin-top: 1rem;
        font-size: 0.875rem;
        color: #6b7280;
        font-style: normal;
      }

      /* Button blocks */
      .gutenberg-content .wp-block-button {
        margin: 1.5rem 0;
      }

      .gutenberg-content .wp-block-button__link {
        background-color: #3b82f6;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.375rem;
        text-decoration: none;
        display: inline-block;
        font-weight: 600;
        transition: all 0.2s;
        border: none;
        cursor: pointer;
      }

      .gutenberg-content .wp-block-button__link:hover {
        background-color: #2563eb;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }

      /* List blocks */
      .gutenberg-content .wp-block-list,
      .gutenberg-content ul:not(.wp-block-gallery),
      .gutenberg-content ol {
        margin: 1.5rem 0;
        padding-left: 1.5rem;
      }

      .gutenberg-content .wp-block-list li,
      .gutenberg-content ul:not(.wp-block-gallery) li,
      .gutenberg-content ol li {
        margin: 0.5rem 0;
        line-height: 1.6;
      }

      /* Separator blocks */
      .gutenberg-content .wp-block-separator,
      .gutenberg-content hr {
        border: none;
        border-top: 2px solid #e5e7eb;
        margin: 3rem auto;
        width: 100px;
      }

      .gutenberg-content .wp-block-separator.is-style-wide {
        width: 100%;
      }

      /* Spacer blocks */
      .gutenberg-content .wp-block-spacer {
        height: 2rem;
        margin: 0;
      }

      /* Table blocks */
      .gutenberg-content .wp-block-table {
        overflow-x: auto;
        margin: 2rem 0;
      }

      .gutenberg-content .wp-block-table table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        overflow: hidden;
      }

      .gutenberg-content .wp-block-table td,
      .gutenberg-content .wp-block-table th {
        border: 1px solid #e5e7eb;
        padding: 0.75rem;
        text-align: left;
      }

      .gutenberg-content .wp-block-table th {
        background-color: #f9fafb;
        font-weight: 600;
      }

      .gutenberg-content .wp-block-table tr:nth-child(even) {
        background-color: #f9fafb;
      }

      /* Code and preformatted blocks */
      .gutenberg-content .wp-block-code,
      .gutenberg-content code {
        background-color: #1f2937;
        color: #f3f4f6;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        overflow-y: auto;
        margin: 1.5rem 0;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.875rem;
        line-height: 1.4;
        white-space: pre-wrap;
        word-wrap: break-word;
        max-height: none;
        height: auto;
      }

      .gutenberg-content .wp-block-code code {
        background: none;
        padding: 0;
        margin: 0;
        color: inherit;
        white-space: pre-wrap;
        word-wrap: break-word;
        display: block;
        width: 100%;
      }

      .gutenberg-content .wp-block-preformatted {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 1.5rem 0;
        white-space: pre-wrap;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }

      /* Verse blocks */
      .gutenberg-content .wp-block-verse {
        background-color: #f8fafc;
        padding: 1.5rem;
        border-left: 4px solid #64748b;
        margin: 2rem 0;
        white-space: pre-wrap;
        font-family: serif;
        font-style: italic;
        line-height: 1.8;
      }

      /* Embed blocks */
      .gutenberg-content .wp-block-embed {
        margin: 2rem 0;
      }

      .gutenberg-content .wp-block-embed__wrapper {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        border-radius: 0.5rem;
      }

      .gutenberg-content .wp-block-embed__wrapper iframe,
      .gutenberg-content .wp-block-embed iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
      }

      /* Cover blocks */
      .gutenberg-content .wp-block-cover {
        position: relative;
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 2rem 0;
        overflow: hidden;
        border-radius: 0.5rem;
      }

      .gutenberg-content .wp-block-cover__inner-container {
        position: relative;
        z-index: 2;
        color: white;
        text-align: center;
        max-width: 800px;
        padding: 2rem;
      }

      .gutenberg-content .wp-block-cover img,
      .gutenberg-content .wp-block-cover video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 0;
      }

      .gutenberg-content .wp-block-cover__gradient-background,
      .gutenberg-content .wp-block-cover::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1;
      }

      /* Audio and video blocks */
      .gutenberg-content .wp-block-audio,
      .gutenberg-content .wp-block-video {
        margin: 2rem 0;
      }

      .gutenberg-content .wp-block-audio audio,
      .gutenberg-content .wp-block-video video {
        width: 100%;
        border-radius: 0.5rem;
      }

      /* Group blocks */
      .gutenberg-content .wp-block-group {
        margin: 2rem 0;
      }

      .gutenberg-content .wp-block-group__inner-container {
        padding: 1.5rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
      }

      /* Fix prose styles conflicts */
      .gutenberg-content.prose figure {
        margin-top: 2em;
        margin-bottom: 2em;
      }

      .gutenberg-content.prose blockquote {
        font-weight: 500;
        font-style: italic;
        color: #374151;
        border-left-width: 0.25rem;
        border-left-color: #d1d5db;
        quotes: "\\201C""\\201D""\\2018""\\2019";
        margin-top: 1.6em;
        margin-bottom: 1.6em;
        padding-left: 1em;
      }

      /* Text Column Block - WordPress specific classes */
      .gutenberg-content .wp-block-text-columns.columns-2 {
        display: flex !important;
        gap: 2rem;
        margin: 2rem 0;
      }

      /* Text Column Block - detect and style as 2 columns */
      .gutenberg-content h2 + div:has(p:first-child:contains("left text column")),
      .gutenberg-content h2 + div:has(p:contains("left") + p:contains("right")) {
        display: flex;
        gap: 2rem;
        margin: 2rem 0;
      }

      .gutenberg-content h2 + div:has(p:contains("left") + p:contains("right")) p {
        flex: 1;
        margin: 0;
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
      }

      /* Alternative approach: style any div with exactly 2 paragraphs as columns */
      .gutenberg-content div:has(> p:nth-child(1):nth-last-child(2)) {
        display: flex;
        gap: 2rem;
        margin: 2rem 0;
      }

      .gutenberg-content div:has(> p:nth-child(1):nth-last-child(2)) p {
        flex: 1;
        margin: 0;
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
      }

      /* Twitter embed improvements - Default Twitter widget appearance */
      .gutenberg-content .wp-block-embed-twitter,
      .gutenberg-content figure:has(blockquote[cite*="twitter.com"]),
      .gutenberg-content blockquote[cite*="twitter.com"],
      .gutenberg-content .twitter-tweet {
        margin: 2rem 0;
        padding: 1rem;
        border: 1px solid #e1e8ed;
        border-radius: 12px;
        background-color: #ffffff;
        max-width: 550px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        position: relative;
      }

      /* Twitter logo/icon in top right */
      .gutenberg-content .wp-block-embed-twitter::before,
      .gutenberg-content figure:has(blockquote[cite*="twitter.com"])::before,
      .gutenberg-content blockquote[cite*="twitter.com"]::before {
        content: "🐦";
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.2rem;
        color: #1da1f2;
      }

      .gutenberg-content .wp-block-embed-twitter blockquote,
      .gutenberg-content figure:has(blockquote[cite*="twitter.com"]) blockquote,
      .gutenberg-content blockquote[cite*="twitter.com"] {
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        background: none !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 1rem;
        line-height: 1.3;
        color: #14171a;
        font-style: normal !important;
      }

      .gutenberg-content .wp-block-embed-twitter blockquote p,
      .gutenberg-content figure:has(blockquote[cite*="twitter.com"]) blockquote p,
      .gutenberg-content blockquote[cite*="twitter.com"] p {
        margin-bottom: 0.75rem;
        font-style: normal;
        color: #14171a;
        font-size: 1rem;
        line-height: 1.3;
      }

      /* Twitter images support */
      .gutenberg-content .wp-block-embed-twitter img,
      .gutenberg-content figure:has(blockquote[cite*="twitter.com"]) img,
      .gutenberg-content blockquote[cite*="twitter.com"] img {
        max-width: 100%;
        border-radius: 8px;
        margin: 0.75rem 0;
        display: block;
      }

      /* Twitter links styling */
      .gutenberg-content .wp-block-embed-twitter a,
      .gutenberg-content figure:has(blockquote[cite*="twitter.com"]) a,
      .gutenberg-content blockquote[cite*="twitter.com"] a {
        color: #1da1f2;
        text-decoration: none;
      }

      .gutenberg-content .wp-block-embed-twitter a:hover,
      .gutenberg-content figure:has(blockquote[cite*="twitter.com"]) a:hover,
      .gutenberg-content blockquote[cite*="twitter.com"] a:hover {
        text-decoration: underline;
      }

      /* Twitter profile info styling */
      .gutenberg-content .wp-block-embed-twitter blockquote::after,
      .gutenberg-content figure:has(blockquote[cite*="twitter.com"]) blockquote::after,
      .gutenberg-content blockquote[cite*="twitter.com"]::after {
        content: "";
        display: block;
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid #e1e8ed;
      }

      /* Author attribution */
      .gutenberg-content .wp-block-embed-twitter cite,
      .gutenberg-content figure:has(blockquote[cite*="twitter.com"]) cite,
      .gutenberg-content blockquote[cite*="twitter.com"] cite {
        display: block;
        margin-top: 0.75rem;
        font-size: 0.875rem;
        color: #657786;
        font-style: normal;
        text-decoration: none;
      }

      /* Twitter embed iframe container */
      .gutenberg-content .wp-block-embed__wrapper iframe[src*="twitter.com"],
      .gutenberg-content iframe[src*="platform.twitter.com"] {
        max-width: 550px;
        border-radius: 12px;
        border: 1px solid #e1e8ed;
      }

      /* General Twitter widget fallbacks */
      .gutenberg-content [class*="twitter"],
      .gutenberg-content [data-twitter-content] {
        max-width: 550px;
        margin: 2rem 0;
        border: 1px solid #e1e8ed;
        border-radius: 12px;
        padding: 1rem;
        background: #ffffff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .gutenberg-content div:has(> p:nth-child(1):nth-last-child(2)) {
          flex-direction: column;
          gap: 1rem;
        }
        
        .gutenberg-content h2 + div:has(p:contains("left") + p:contains("right")) {
          flex-direction: column;
          gap: 1rem;
        }
      }

      @media (max-width: 640px) {
        .gutenberg-content .alignfull {
          margin-left: -1rem;
          margin-right: -1rem;
          width: calc(100% + 2rem);
          max-width: calc(100% + 2rem);
        }
        
        .gutenberg-content .wp-block-gallery {
          gap: 0.5rem;
        }
        
        .gutenberg-content .wp-block-gallery .wp-block-image,
        .gutenberg-content .wp-block-gallery li {
          min-width: 150px;
        }
        
        .gutenberg-content .wp-block-cover {
          min-height: 250px;
        }
        
        .gutenberg-content .wp-block-cover__inner-container {
          padding: 1rem;
        }
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
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">React Tweet Example</h2>
        <Tweet id="993606431126548481" />
      </div>
    </>
  );
}