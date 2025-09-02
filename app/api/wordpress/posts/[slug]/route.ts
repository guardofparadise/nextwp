import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://wordpress-1406888-5229870.cloudwaysapps.com';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Build WordPress API URL for single post by slug using index.php?rest_route format
    const wpUrl = new URL(`${WP_API_BASE}/index.php`);
    wpUrl.searchParams.set('rest_route', '/wp/v2/posts');
    wpUrl.searchParams.set('slug', slug);
    wpUrl.searchParams.set('_embed', 'true');

    const response = await fetch(wpUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`);
    }

    const data = await response.json();
    const post = data[0] || null;

    return NextResponse.json({ post });
  } catch (error) {
    console.error('WordPress API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post', post: null },
      { status: 500 }
    );
  }
}