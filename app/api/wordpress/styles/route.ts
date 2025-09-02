import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://vladclaudecode.wpenginepowered.com';
const WP_SITE_URL = WP_API_BASE;

export async function GET(request: NextRequest) {
  try {
    // Fetch the homepage or any page to extract styles
    const homeUrl = `${WP_SITE_URL}/`;
    
    console.log('Fetching WordPress styles from:', homeUrl);
    
    const response = await fetch(homeUrl, {
      headers: {
        'User-Agent': 'NextJS-Frontend/1.0',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch WordPress page: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract Elementor styles and other important styles
    const styles: string[] = [];
    const scripts: string[] = [];
    
    // Extract all <style> tags
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    while ((styleMatch = styleRegex.exec(html)) !== null) {
      if (styleMatch[1]) {
        // Check if it's Elementor-related or global styles
        if (styleMatch[0].includes('elementor') || 
            styleMatch[0].includes('id="global-styles"') ||
            styleMatch[0].includes('id="wp-block-library"') ||
            styleMatch[0].includes('custom-css')) {
          styles.push(styleMatch[1]);
        }
      }
    }
    
    // Extract external stylesheet links
    const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*>/gi;
    const links: string[] = [];
    let linkMatch;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      // Extract href from link tag
      const hrefMatch = /href=["']([^"']+)["']/.exec(linkMatch[0]);
      if (hrefMatch && hrefMatch[1]) {
        // Filter for Elementor and WordPress core styles
        if (hrefMatch[1].includes('elementor') || 
            hrefMatch[1].includes('wp-content/themes') ||
            hrefMatch[1].includes('wp-includes/css')) {
          links.push(hrefMatch[1]);
        }
      }
    }

    // Extract Elementor configuration if present
    const elementorConfigRegex = /var\s+elementorFrontendConfig\s*=\s*({[\s\S]*?});/;
    const configMatch = elementorConfigRegex.exec(html);
    let elementorConfig = null;
    if (configMatch && configMatch[1]) {
      try {
        // Clean up the JavaScript object string for JSON parsing
        const cleanConfig = configMatch[1]
          .replace(/'/g, '"')
          .replace(/(\w+):/g, '"$1":')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');
        elementorConfig = JSON.parse(cleanConfig);
      } catch (e) {
        console.log('Could not parse Elementor config');
      }
    }

    // Extract root CSS variables (custom properties)
    const rootVarsRegex = /:root\s*{([^}]+)}/gi;
    let rootVarsMatch;
    let rootVars = '';
    while ((rootVarsMatch = rootVarsRegex.exec(html)) !== null) {
      if (rootVarsMatch[1]) {
        rootVars += rootVarsMatch[1];
      }
    }

    // Also look for Elementor custom CSS
    const customCssRegex = /\.elementor-kit-\d+\s*{([^}]+)}/gi;
    let customCssMatch;
    let customCss = '';
    while ((customCssMatch = customCssRegex.exec(html)) !== null) {
      customCss += customCssMatch[0] + '\n';
    }

    return NextResponse.json({
      styles: styles.join('\n'),
      stylesheets: links,
      elementorConfig,
      rootVars,
      customCss,
      // Include some important Elementor base styles
      elementorBase: `
        /* Elementor Base Styles */
        .elementor-section {
          position: relative;
        }
        .elementor-container {
          display: flex;
          margin-right: auto;
          margin-left: auto;
          position: relative;
        }
        .elementor-column {
          position: relative;
          min-height: 1px;
          display: flex;
        }
        .elementor-widget-wrap {
          position: relative;
          width: 100%;
          flex-wrap: wrap;
          align-content: flex-start;
        }
        .elementor-widget {
          position: relative;
        }
        .elementor-column-gap-default > .elementor-column > .elementor-element-populated {
          padding: 10px;
        }
        .elementor-widget-container {
          transition: background .3s,border .3s,border-radius .3s,box-shadow .3s;
        }
        /* Elementor Responsive */
        @media (max-width: 1024px) {
          .elementor-reverse-tablet > .elementor-container > .elementor-row > :first-child {
            order: 10;
          }
        }
        @media (max-width: 767px) {
          .elementor-reverse-mobile > .elementor-container > .elementor-row > :first-child {
            order: 10;
          }
        }
      `,
    });
  } catch (error) {
    console.error('WordPress Styles API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch styles',
        styles: '',
        stylesheets: [],
        elementorConfig: null,
        rootVars: '',
        customCss: '',
        elementorBase: '',
      },
      { status: 500 }
    );
  }
}