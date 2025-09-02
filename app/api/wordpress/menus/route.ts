import { NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://vladclaudecode.wpenginepowered.com';

export async function GET() {
  try {
    // First try the WordPress REST API Menus plugin endpoint
    const wpMenuUrl = new URL(`${WP_API_BASE}/index.php`);
    wpMenuUrl.searchParams.set('rest_route', '/wp-api-menus/v2/menus');
    
    let response = await fetch(wpMenuUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    // If menus plugin is not available, fall back to pages
    if (!response.ok || response.status === 404) {
      console.log('Menu API not available, fetching pages instead');
      
      // Fetch pages as fallback for navigation
      const pagesUrl = new URL(`${WP_API_BASE}/index.php`);
      pagesUrl.searchParams.set('rest_route', '/wp/v2/pages');
      pagesUrl.searchParams.set('per_page', '100');
      pagesUrl.searchParams.set('orderby', 'menu_order');
      pagesUrl.searchParams.set('order', 'asc');
      
      response = await fetch(pagesUrl.toString(), {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch pages: ${response.status}`);
      }

      const pages = await response.json();
      
      // Transform pages into menu items
      const menuItems = pages.map((page: {
        id: number;
        title: { rendered: string };
        slug: string;
        parent: number;
        menu_order: number;
      }) => ({
        id: page.id,
        title: page.title.rendered,
        url: `/${page.slug}`,
        slug: page.slug,
        parent: page.parent,
        order: page.menu_order,
      }));

      return NextResponse.json({ 
        menu: menuItems.filter((item: { parent: number }) => item.parent === 0), // Only top-level pages
        type: 'pages' 
      });
    }

    const data = await response.json();
    return NextResponse.json({ menu: data, type: 'menu' });
    
  } catch (error) {
    console.error('WordPress Menu API error:', error);
    
    // Return default menu as fallback
    const defaultMenu = [
      { id: 1, title: 'Home', url: '/', slug: 'home' },
      { id: 2, title: 'Blog', url: '/blog', slug: 'blog' },
      { id: 3, title: 'About', url: '/about', slug: 'about' },
      { id: 4, title: 'Contact', url: '/contact', slug: 'contact' },
    ];
    
    return NextResponse.json({ menu: defaultMenu, type: 'default' });
  }
}