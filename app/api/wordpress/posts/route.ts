import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://wordpress-1406888-5229870.cloudwaysapps.com';
// Use index.php?rest_route format for better compatibility
const WP_API_BASE_URL = WP_API_BASE;

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  console.log('🚀 WordPress Posts API called at:', new Date().toISOString());
  console.log('🔧 Environment variables:', {
    NEXT_PUBLIC_WORDPRESS_API_URL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV
  });
  
  try {
    const { searchParams } = new URL(request.url);
    console.log('📋 Query parameters:', Object.fromEntries(searchParams.entries()));
    
    // Build WordPress API URL with query parameters using index.php?rest_route format
    const wpUrl = new URL(`${WP_API_BASE_URL}/index.php`);
    wpUrl.searchParams.set('rest_route', '/wp/v2/posts');
    
    // Forward all query parameters to WordPress API
    searchParams.forEach((value, key) => {
      wpUrl.searchParams.set(key, value);
    });

    console.log('🌐 Fetching from WordPress API:', wpUrl.toString());
    console.log('🏗️ WP_API_BASE:', WP_API_BASE);
    console.log('🏗️ WP_API_BASE_URL:', WP_API_BASE_URL);

    const response = await fetch(wpUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Frontend/1.0',
      },
      cache: 'no-store', // Disable caching for development
      redirect: 'follow', // Follow redirects
    });

    const fetchTime = Date.now();
    console.log('⏱️ Fetch started at:', fetchTime - startTime, 'ms');
    
    console.log('✅ WordPress API response status:', response.status);
    console.log('📊 WordPress API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ WordPress API error response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText.substring(0, 500)
      });
      throw new Error(`WordPress API error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const contentType = response.headers.get('content-type');
    console.log('📝 Content-Type:', contentType);
    
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('❌ WordPress API returned non-JSON:', {
        contentType,
        body: responseText.substring(0, 500)
      });
      throw new Error('WordPress API returned non-JSON response');
    }

    const parseTime = Date.now();
    const data = await response.json();
    const total = response.headers.get('x-wp-total') || '0';
    const totalPages = response.headers.get('x-wp-totalpages') || '0';
    
    const endTime = Date.now();
    console.log('🎉 WordPress API success:', {
      totalPosts: data.length,
      totalFromHeader: total,
      totalPages,
      timings: {
        fetch: fetchTime - startTime,
        parse: parseTime - fetchTime,
        total: endTime - startTime
      }
    });

    return NextResponse.json({
      posts: data,
      total: parseInt(total),
      totalPages: parseInt(totalPages),
    });
  } catch (error) {
    const endTime = Date.now();
    console.error('💥 WordPress API proxy error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      totalTime: endTime - startTime,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts', 
        posts: [], 
        total: 0, 
        totalPages: 0,
        debug: {
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV,
          wpApiUrl: WP_API_BASE_URL
        }
      },
      { status: 500 }
    );
  }
}