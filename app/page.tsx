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
  
  try {
    // Fetch all posts (increase per_page to get all)
    const data = await wpApi.getPosts({ per_page: 100, _embed: true });
    posts = data?.posts || [];
    console.log(`Fetched ${posts.length} posts from WordPress`);
  } catch (error) {
    console.error('Error fetching posts:', error);
    posts = [];
    hasError = true;
  }

  // Fetch homepage content from WordPress
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3004';
    const response = await fetch(`${baseUrl}/api/wordpress/pages/home`, {
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
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    WordPress API Connection Issue
                  </h3>
                  <p className="text-yellow-700 mb-4">
                    The WordPress REST API appears to be disabled or unavailable. 
                    Please check your WordPress configuration.
                  </p>
                  <div className="text-sm text-yellow-600">
                    <p className="font-medium mb-1">To fix this:</p>
                    <ol className="list-decimal list-inside space-y-1 text-left">
                      <li>Ensure WordPress REST API is enabled</li>
                      <li>Check permalink settings (use &ldquo;Post name&rdquo;)</li>
                      <li>Verify the API URL in .env.local</li>
                      <li>Check for security plugins blocking API access</li>
                    </ol>
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