import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/api';
import { formatDate, getExcerpt, getFeaturedImageUrl, getAuthorName, stripHtml } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const featuredImage = getFeaturedImageUrl(post);
  const authorName = getAuthorName(post);
  const excerpt = post.excerpt?.rendered 
    ? stripHtml(post.excerpt.rendered) 
    : getExcerpt(post.content.rendered);

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {featuredImage && (
        <Link href={`/blog/${post.slug}`}>
          <div className="relative h-48 w-full">
            <Image
              src={featuredImage}
              alt={stripHtml(post.title.rendered)}
              fill
              className="object-cover hover:opacity-90 transition-opacity"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      )}
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="mx-2">•</span>
          <span>{authorName}</span>
        </div>
        
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {stripHtml(post.title.rendered)}
          </h2>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Read more
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}