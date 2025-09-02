import { MetadataRoute } from 'next';
import { wpApi, Post, Page } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

  let posts: Post[] = [];
  let pages: Page[] = [];

  try {
    const postsData = await wpApi.getPosts({ per_page: 100 });
    posts = postsData.posts || [];
  } catch (error) {
    console.log('Could not fetch posts for sitemap:', error);
  }

  try {
    const pagesData = await wpApi.getPages({ per_page: 100 });
    pages = pagesData.pages || [];
  } catch (error) {
    console.log('Could not fetch pages for sitemap:', error);
  }

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const pageUrls = pages.map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.modified),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...postUrls,
    ...pageUrls,
  ];
}