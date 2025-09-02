import { NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://vladclaudecode.wpenginepowered.com';

export async function GET() {
  try {
    // Fetch the WordPress homepage to extract header content
    const homeUrl = `${WP_API_BASE}/`;
    
    console.log('Fetching WordPress header from:', homeUrl);
    
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
    
    // Extract header content between header tags or Elementor header
    let headerContent = '';
    
    // Try to find Elementor header template
    const elementorHeaderRegex = /<div[^>]*data-elementor-type="header"[^>]*>([\s\S]*?)<\/div>(?=\s*<div[^>]*data-elementor-type="(?:wp-post|wp-page|footer)")/i;
    const elementorHeaderMatch = elementorHeaderRegex.exec(html);
    
    if (elementorHeaderMatch) {
      headerContent = elementorHeaderMatch[0];
    } else {
      // Try to find regular header tag
      const headerRegex = /<header[^>]*>([\s\S]*?)<\/header>/i;
      const headerMatch = headerRegex.exec(html);
      
      if (headerMatch) {
        headerContent = headerMatch[0];
      } else {
        // Try to find header by class
        const headerClassRegex = /<div[^>]*class="[^"]*(?:site-header|page-header|header)[^"]*"[^>]*>([\s\S]*?)<\/div>/i;
        const headerClassMatch = headerClassRegex.exec(html);
        
        if (headerClassMatch) {
          headerContent = headerClassMatch[0];
        }
      }
    }
    
    // Extract header styles
    const headerStyles: string[] = [];
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    
    while ((styleMatch = styleRegex.exec(html)) !== null) {
      if (styleMatch[1] && (
        styleMatch[1].includes('header') ||
        styleMatch[1].includes('navigation') ||
        styleMatch[1].includes('menu') ||
        styleMatch[1].includes('.site-header') ||
        styleMatch[1].includes('.elementor-location-header')
      )) {
        headerStyles.push(styleMatch[1]);
      }
    }
    
    return NextResponse.json({
      content: headerContent,
      styles: headerStyles.join('\n'),
      hasContent: !!headerContent,
    });
    
  } catch (error) {
    console.error('WordPress Header API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch header',
        content: '',
        styles: '',
        hasContent: false,
      },
      { status: 500 }
    );
  }
}