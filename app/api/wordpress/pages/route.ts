import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://vladclaudecode.wpenginepowered.com';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build WordPress API URL for pages using index.php?rest_route format
    const wpUrl = new URL(`${WP_API_BASE}/index.php`);
    wpUrl.searchParams.set('rest_route', '/wp/v2/pages');
    
    // Forward all query parameters to WordPress API
    searchParams.forEach((value, key) => {
      wpUrl.searchParams.set(key, value);
    });

    console.log('Fetching WordPress pages from:', wpUrl.toString());

    const response = await fetch(wpUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const data = await response.json();
    const total = response.headers.get('x-wp-total') || '0';
    const totalPages = response.headers.get('x-wp-totalpages') || '0';

    return NextResponse.json({
      pages: data,
      total: parseInt(total),
      totalPages: parseInt(totalPages),
    });
  } catch (error) {
    console.error('WordPress Pages API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages', pages: [], total: 0, totalPages: 0 },
      { status: 500 }
    );
  }
}