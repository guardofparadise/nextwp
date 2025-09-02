'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface MenuItem {
  id: number;
  title: string;
  url: string;
  slug: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState<MenuItem[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Fetch dynamic menu from WordPress
    fetch('/api/wordpress/menus')
      .then(res => res.json())
      .then(data => {
        if (data.menu && Array.isArray(data.menu)) {
          // Transform menu items to match our format
          const menuItems = data.menu.map((item: {
            id: number;
            title: string;
            url: string;
            slug: string;
          }) => ({
            id: item.id,
            title: item.title.replace(/&#8217;/g, "'").replace(/&amp;/g, "&"),
            url: item.url,
            slug: item.slug,
          }));
          setNavigation(menuItems);
        }
      })
      .catch(err => {
        console.error('Failed to fetch menu:', err);
        // Fallback to default menu
        setNavigation([
          { id: 1, title: 'Home', url: '/', slug: 'home' },
          { id: 2, title: 'Blog', url: '/blog', slug: 'blog' },
          { id: 3, title: 'About', url: '/about', slug: 'about' },
          { id: 4, title: 'Contact', url: '/contact', slug: 'contact' },
        ]);
      });
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Vlad Headless CMS
              </h1>
            </Link>
          </div> */}

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.url)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.url)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}