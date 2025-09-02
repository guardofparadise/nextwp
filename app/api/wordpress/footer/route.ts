import { NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://vladclaudecode.wpenginepowered.com';

export async function GET() {
  try {
    // Fetch the WordPress homepage to extract footer content
    const homeUrl = `${WP_API_BASE}/`;
    
    console.log('Fetching WordPress footer from:', homeUrl);
    
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
    
    // Extract footer content
    let footerContent = '';
    
    // Try to find Elementor footer template
    const elementorFooterRegex = /<div[^>]*data-elementor-type="footer"[^>]*>([\s\S]*?)<\/div>(?=\s*(?:<\/div>)*\s*<\/body>)/i;
    const elementorFooterMatch = elementorFooterRegex.exec(html);
    
    if (elementorFooterMatch) {
      footerContent = elementorFooterMatch[0];
    } else {
      // Try to find regular footer tag
      const footerRegex = /<footer[^>]*>([\s\S]*?)<\/footer>/i;
      const footerMatch = footerRegex.exec(html);
      
      if (footerMatch) {
        footerContent = footerMatch[0];
      } else {
        // Try to find footer by class
        const footerClassRegex = /<div[^>]*class="[^"]*(?:site-footer|page-footer|footer)[^"]*"[^>]*>([\s\S]*?)<\/div>(?=\s*(?:<\/div>)*\s*<\/body>)/i;
        const footerClassMatch = footerClassRegex.exec(html);
        
        if (footerClassMatch) {
          footerContent = footerClassMatch[0];
        }
      }
    }
    
    // Extract footer styles
    const footerStyles: string[] = [];
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    
    while ((styleMatch = styleRegex.exec(html)) !== null) {
      if (styleMatch[1] && (
        styleMatch[1].includes('footer') ||
        styleMatch[1].includes('.site-footer') ||
        styleMatch[1].includes('.elementor-location-footer') ||
        styleMatch[1].includes('copyright')
      )) {
        footerStyles.push(styleMatch[1]);
      }
    }
    
    return NextResponse.json({
      content: footerContent,
      styles: footerStyles.join('\n'),
      hasContent: !!footerContent,
    });
    
  } catch (error) {
    console.error('WordPress Footer API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch footer',
        content: '',
        styles: '',
        hasContent: false,
      },
      { status: 500 }
    );
  }
}