import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://vladclaudecode.wpenginepowered.com';
// Use index.php?rest_route format for better compatibility
const WP_API_BASE_URL = WP_API_BASE;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build WordPress API URL with query parameters using index.php?rest_route format
    const wpUrl = new URL(`${WP_API_BASE_URL}/index.php`);
    wpUrl.searchParams.set('rest_route', '/wp/v2/posts');
    
    // Forward all query parameters to WordPress API
    searchParams.forEach((value, key) => {
      wpUrl.searchParams.set(key, value);
    });

    console.log('Fetching from WordPress API:', wpUrl.toString());

    const response = await fetch(wpUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Frontend/1.0',
      },
      cache: 'no-store', // Disable caching for development
      redirect: 'follow', // Follow redirects
    });

    console.log('WordPress API response status:', response.status);
    console.log('WordPress API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('WordPress API error response:', errorText);
      throw new Error(`WordPress API error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('WordPress API returned non-JSON:', responseText.substring(0, 200));
      throw new Error('WordPress API returned non-JSON response');
    }

    const data = await response.json();
    const total = response.headers.get('x-wp-total') || '0';
    const totalPages = response.headers.get('x-wp-totalpages') || '0';

    return NextResponse.json({
      posts: data,
      total: parseInt(total),
      totalPages: parseInt(totalPages),
    });
  } catch (error) {
    console.error('WordPress API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', posts: [], total: 0, totalPages: 0 },
      { status: 500 }
    );
  }
}