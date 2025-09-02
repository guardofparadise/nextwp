import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://wordpress-1406888-5229870.cloudwaysapps.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Build WordPress API URL for single page by slug using index.php?rest_route format
    const wpUrl = new URL(`${WP_API_BASE}/index.php`);
    wpUrl.searchParams.set('rest_route', '/wp/v2/pages');
    wpUrl.searchParams.set('slug', slug);
    wpUrl.searchParams.set('_embed', 'true');

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
    const page = data[0] || null;

    return NextResponse.json({ page });
  } catch (error) {
    console.error('WordPress Page API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page', page: null },
      { status: 500 }
    );
  }
}