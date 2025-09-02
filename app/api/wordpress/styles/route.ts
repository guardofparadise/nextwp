import { NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://vladclaudecode.wpenginepowered.com';
// Force HTTPS for stylesheets
const WP_SITE_URL = WP_API_BASE.replace('http://', 'https://');

export async function GET() {
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
    
    // Extract all <style> tags - be more inclusive
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    while ((styleMatch = styleRegex.exec(html)) !== null) {
      if (styleMatch[1]) {
        // Include all Elementor styles, custom CSS, and inline styles
        if (styleMatch[0].includes('elementor') || 
            styleMatch[0].includes('id="global-styles"') ||
            styleMatch[0].includes('id="wp-block-library"') ||
            styleMatch[0].includes('custom-css') ||
            styleMatch[0].includes('inline-css') ||
            styleMatch[1].includes('.elementor-') ||
            styleMatch[1].includes('.e-con') ||
            styleMatch[1].includes('.e-container')) {
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
          // Ensure HTTPS for all stylesheet URLs
          const url = hrefMatch[1].replace('http://', 'https://');
          links.push(url);
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
      } catch {
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
      // Include comprehensive Elementor base styles
      elementorBase: `
        /* Elementor Base Styles */
        .elementor {
          -webkit-hyphens: manual;
          -ms-hyphens: manual;
          hyphens: manual;
        }
        .elementor *, .elementor *:before, .elementor *:after {
          box-sizing: border-box;
        }
        
        /* Elementor Containers - Modern Flexbox Layout */
        .e-container, .e-con {
          --container-max-width: 1140px;
          --container-padding: 15px;
          display: flex;
          position: relative;
          min-height: 1px;
        }
        .e-con-boxed {
          max-width: var(--container-max-width);
          margin-left: auto;
          margin-right: auto;
          padding-left: var(--container-padding);
          padding-right: var(--container-padding);
        }
        .e-con-full {
          width: 100%;
          max-width: 100%;
        }
        .e-con > .e-con-inner {
          width: 100%;
          display: flex;
        }
        .e-con-inner > .elementor-widget-wrap {
          width: 100%;
        }
        
        /* Legacy Sections and Containers */
        .elementor-section {
          position: relative;
        }
        .elementor-section-boxed > .elementor-container {
          max-width: 1140px;
          margin: 0 auto;
        }
        .elementor-section-full_width > .elementor-container {
          max-width: 100%;
        }
        .elementor-container {
          display: flex;
          margin-right: auto;
          margin-left: auto;
          position: relative;
          width: 100%;
          max-width: 1140px;
          padding: 0 15px;
        }
        
        /* Columns */
        .elementor-column {
          position: relative;
          min-height: 1px;
          display: flex;
          flex: 1;
        }
        .elementor-column-wrap, .elementor-widget-wrap {
          position: relative;
          width: 100%;
          flex-wrap: wrap;
          align-content: flex-start;
          display: flex;
        }
        
        /* Column Widths */
        .elementor-col-10 { width: 10%; }
        .elementor-col-20 { width: 20%; }
        .elementor-col-25 { width: 25%; }
        .elementor-col-30 { width: 30%; }
        .elementor-col-33 { width: 33.333%; }
        .elementor-col-40 { width: 40%; }
        .elementor-col-50 { width: 50%; }
        .elementor-col-60 { width: 60%; }
        .elementor-col-66 { width: 66.666%; }
        .elementor-col-70 { width: 70%; }
        .elementor-col-75 { width: 75%; }
        .elementor-col-80 { width: 80%; }
        .elementor-col-90 { width: 90%; }
        .elementor-col-100 { width: 100%; }
        
        /* Widgets */
        .elementor-widget {
          position: relative;
          width: 100%;
        }
        .elementor-widget-container {
          transition: background .3s, border .3s, border-radius .3s, box-shadow .3s;
          width: 100%;
        }
        
        /* Gaps and Spacing */
        .elementor-column-gap-default > .elementor-column > .elementor-element-populated {
          padding: 10px;
        }
        .elementor-column-gap-narrow > .elementor-column > .elementor-element-populated {
          padding: 5px;
        }
        .elementor-column-gap-extended > .elementor-column > .elementor-element-populated {
          padding: 15px;
        }
        .elementor-column-gap-wide > .elementor-column > .elementor-element-populated {
          padding: 20px;
        }
        .elementor-column-gap-wider > .elementor-column > .elementor-element-populated {
          padding: 30px;
        }
        
        /* Element Populated */
        .elementor-element-populated {
          width: 100%;
        }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .elementor-container {
            max-width: 100%;
          }
          .elementor-reverse-tablet > .elementor-container > .elementor-row > :first-child {
            order: 10;
          }
          .elementor-col-md-10 { width: 10%; }
          .elementor-col-md-20 { width: 20%; }
          .elementor-col-md-25 { width: 25%; }
          .elementor-col-md-33 { width: 33.333%; }
          .elementor-col-md-50 { width: 50%; }
          .elementor-col-md-66 { width: 66.666%; }
          .elementor-col-md-100 { width: 100%; }
        }
        
        @media (max-width: 767px) {
          .elementor-container {
            flex-direction: column;
          }
          .elementor-column {
            width: 100% !important;
          }
          .elementor-reverse-mobile > .elementor-container > .elementor-row > :first-child {
            order: 10;
          }
          .e-con-boxed {
            --container-padding: 10px;
          }
        }
        
        /* Text and Content Alignment */
        .elementor-align-left { text-align: left; }
        .elementor-align-center { text-align: center; }
        .elementor-align-right { text-align: right; }
        .elementor-align-justify { text-align: justify; }
        
        /* Display utilities */
        .elementor-hidden { display: none; }
        .elementor-invisible { visibility: hidden; }
        
        /* Clear fixes */
        .elementor-clearfix:after {
          content: "";
          display: table;
          clear: both;
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