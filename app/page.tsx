import { wpApi, Post } from '@/lib/api';
import PostCard from '@/components/PostCard';
import PageElementorStyles from '@/components/PageElementorStyles';
import Link from 'next/link';

export default async function Home() {
  let posts: Post[] = [];
  let homepageContent: {
    content: { rendered: string };
  } | null = null;
  let hasError = false;
  let errorDetails: string = '';
  
  try {
    console.log('🏠 Homepage: Starting to fetch posts...');
    console.log('🔧 Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      NEXT_PUBLIC_WORDPRESS_API_URL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL
    });
    
    const startTime = Date.now();
    const data = await wpApi.getPosts({ per_page: 100, _embed: true });
    const endTime = Date.now();
    
    posts = data?.posts || [];
    console.log(`✅ Successfully fetched ${posts.length} posts from WordPress (${endTime - startTime}ms)`);
    console.log('📊 Posts data structure:', {
      totalPosts: data?.total,
      totalPages: data?.totalPages,
      firstPostTitle: posts[0]?.title?.rendered || 'N/A'
    });
  } catch (error) {
    posts = [];
    hasError = true;
    errorDetails = error instanceof Error ? error.message : String(error);
    console.error('❌ Error fetching posts:', {
      message: errorDetails,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }

  // Fetch homepage content from WordPress
  try {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV;
    const baseUrl = isProduction 
      ? 'https://vladclaudecode.wpenginepowered.com/wp-json/wp/v2'
      : 'http://localhost:3006/api/wordpress';
    
    console.log('🏠 Homepage content fetch URL:', `${baseUrl}/pages/home`);
    const response = await fetch(`${baseUrl}/pages/home`, {
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      homepageContent = data.page;
    }
  } catch (error) {
    console.error('Error fetching homepage content:', error);
  }

  return (
    <>
      {/* Display custom homepage content if available */}
      {homepageContent ? (
        <>
          <PageElementorStyles content={homepageContent.content.rendered} />
          <section className="elementor-page-content">
            <div 
              className="elementor-content"
              dangerouslySetInnerHTML={{ __html: homepageContent.content.rendered }}
            />
          </section>
        </>
      ) : (
        <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to Our Blog
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Discover amazing content powered by WordPress headless CMS and built with Next.js
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/blog"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Explore Blog
                </Link>
                <Link
                  href="/about"
                  className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium border border-gray-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Posts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore all our articles and insights - {posts.length} posts available
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(posts) && posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {Array.isArray(posts) && posts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
              >
                View All Posts
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          )}

          {(!Array.isArray(posts) || posts.length === 0) && (
            <div className="text-center py-12">
              {hasError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-red-800 mb-2">
                        WordPress API Error
                      </h3>
                      <div className="text-red-700 mb-4">
                        <p className="text-sm mb-2">Failed to fetch posts from WordPress API:</p>
                        <div className="bg-red-100 border border-red-200 rounded p-3">
                          <code className="text-xs text-red-800 break-all">
                            {errorDetails}
                          </code>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link 
                          href="/"
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                        >
                          Retry
                          <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </Link>
                        <a 
                          href="https://vladclaudecode.wpenginepowered.com/wp-json/wp/v2/posts" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                        >
                          Test API
                          <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-lg">No posts available yet. Check back soon!</p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-gray-600 mb-8">
              Our website leverages the power of Next.js for blazing-fast performance 
              and WordPress as a headless CMS for flexible content management.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">
                  Built with Next.js for optimal performance and user experience
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Flexible CMS</h3>
                <p className="text-gray-600 text-sm">
                  WordPress headless CMS for easy content management
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Modern Design</h3>
                <p className="text-gray-600 text-sm">
                  Beautiful, responsive design with Tailwind CSS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}