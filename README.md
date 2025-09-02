# WordPress Next.js Frontend

A professional Next.js frontend application connected to WordPress as a headless CMS.

## Features

- ⚡ **Next.js 14** with App Router for optimal performance
- 🎨 **Tailwind CSS** for modern, responsive styling
- 📝 **WordPress REST API** integration for content management
- 🔍 **SEO Optimized** with metadata, sitemap, and robots.txt
- 📱 **Fully Responsive** design for all devices
- 🚀 **TypeScript** for type safety and better developer experience
- 💾 **SWR** for efficient data fetching and caching
- ⚠️ **Error Handling** with custom error pages
- 🔄 **Loading States** for better user experience

## Prerequisites

- Node.js 18+ installed
- A WordPress installation with REST API enabled
- WordPress permalink structure set to "Post name" for clean URLs

## Installation

1. Navigate to the project directory:
```bash
cd wordpress-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Update `.env.local` file
   - Set `NEXT_PUBLIC_WORDPRESS_API_URL` with your WordPress API endpoint
   - Set `NEXT_PUBLIC_SITE_URL` with your site URL (optional)

## Configuration

### WordPress API Setup

Update the `.env.local` file with your WordPress API endpoint:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
NEXT_PUBLIC_SITE_URL=https://your-nextjs-site.com
```

### Image Domains

If your WordPress site uses a different domain for images, add it to `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-wordpress-site.com',
    },
  ],
}
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
wordpress-frontend/
├── app/                    # Next.js app directory
│   ├── blog/              # Blog listing and posts
│   │   ├── [slug]/        # Individual blog post pages
│   │   └── page.tsx       # Blog listing page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── error.tsx          # Error boundary
│   ├── loading.tsx        # Loading state
│   ├── not-found.tsx      # 404 page
│   ├── sitemap.ts         # Sitemap generation
│   └── robots.ts          # Robots.txt generation
├── components/            # Reusable components
│   ├── Header.tsx         # Site header
│   ├── Footer.tsx         # Site footer
│   ├── Layout.tsx         # Layout wrapper
│   ├── PostCard.tsx       # Post card component
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── ErrorMessage.tsx   # Error display
├── lib/                   # Utilities and API
│   ├── api.ts            # WordPress API client
│   ├── hooks.ts          # Custom React hooks
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## API Integration

The application uses the WordPress REST API to fetch:
- Posts with pagination
- Individual posts by slug
- Pages
- Categories and tags
- Featured images
- Author information

### Available Hooks

- `usePosts()` - Fetch posts with pagination
- `usePost(slug)` - Fetch individual post
- `usePages()` - Fetch pages
- `usePage(slug)` - Fetch individual page
- `useCategories()` - Fetch categories
- `useTags()` - Fetch tags

## Building for Production

```bash
npm run build
npm start
```

## Deployment

The application can be deployed to any platform that supports Next.js:

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker containers

## Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic code splitting with Next.js
- **Caching**: SWR for client-side caching
- **Static Generation**: Where possible, pages are statically generated
- **SEO**: Complete metadata, sitemap, and structured data

## Customization

### Styling
- Modify Tailwind config in `tailwind.config.ts`
- Update global styles in `app/globals.css`
- Component styles use Tailwind utility classes

### Navigation
- Edit navigation items in `components/Header.tsx`
- Footer links in `components/Footer.tsx`

### Content Types
- Extend the API client in `lib/api.ts` for custom post types
- Add new interfaces for custom fields
- Create new hooks in `lib/hooks.ts`

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your WordPress installation allows requests from your Next.js domain.

### API Not Found
Verify the WordPress REST API is enabled and the permalink structure is set correctly.

### Images Not Loading
Check that image domains are properly configured in `next.config.ts`.

## License

MIT

## Support

For issues and questions, please create an issue in the repository.