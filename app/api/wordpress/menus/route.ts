import { NextResponse } from 'next/server';

// const WP_API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') || 'https://vladclaudecode.wpenginepowered.com';

export async function GET() {
  try {
    // Since WordPress REST API Menus plugin is not available,
    // return a curated default menu that represents the Main Menu
    console.log('Using curated main menu');
    
    // Return default menu as fallback
    const defaultMenu = [
      { id: 1, title: 'Home', url: '/', slug: 'home' },
      { id: 2, title: 'Blog', url: '/blog', slug: 'blog' },
      { id: 3, title: 'About', url: '/about', slug: 'about' },
      { id: 4, title: 'Contact', url: '/contact', slug: 'contact' },
    ];
    
    return NextResponse.json({ menu: defaultMenu, type: 'default' });
    
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