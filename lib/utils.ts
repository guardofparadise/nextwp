export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function stripHtml(html: string): string {
  if (typeof window !== 'undefined') {
    // Client-side: use DOMParser
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  } else {
    // Server-side: use regex to strip HTML tags
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function getExcerpt(content: string, maxLength: number = 150): string {
  const stripped = stripHtml(content);
  return truncateText(stripped, maxLength);
}

export function getFeaturedImageUrl(post: {
  _embedded?: { 'wp:featuredmedia'?: Array<{ source_url: string }> };
}): string | null {
  if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return null;
}

export function getAuthorName(post: {
  _embedded?: { author?: Array<{ name: string }> };
}): string {
  if (post._embedded?.author?.[0]?.name) {
    return post._embedded.author[0].name;
  }
  return 'Unknown Author';
}

export function getAuthorAvatar(post: {
  _embedded?: { author?: Array<{ avatar_urls: { '96': string } }> };
}): string | null {
  if (post._embedded?.author?.[0]?.avatar_urls?.['96']) {
    return post._embedded.author[0].avatar_urls['96'];
  }
  return null;
}

export function sanitizeHtml(html: string): string {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
}