import { wpApi } from '@/lib/api';
import { sanitizeHtml, stripHtml } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company and mission',
};

export default async function AboutPage() {
  const page = await wpApi.getPage('about');

  if (page) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {stripHtml(page.title.rendered)}
          </h1>
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content.rendered) }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 mb-6">
            Welcome to our professional Next.js website powered by WordPress as a headless CMS. 
            We combine the best of both worlds - the flexibility and familiarity of WordPress 
            content management with the performance and modern development experience of Next.js.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            Our mission is to deliver high-quality content and exceptional user experiences 
            through cutting-edge web technologies. We believe in the power of modern web 
            development to create fast, accessible, and engaging digital experiences.
          </p>

          <h2 className="text-3xl font-bold mt-8 mb-4">What We Do</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-6">
            <li className="mb-2">Create engaging and informative content</li>
            <li className="mb-2">Leverage modern web technologies for optimal performance</li>
            <li className="mb-2">Provide seamless user experiences across all devices</li>
            <li className="mb-2">Continuously innovate and improve our platform</li>
          </ul>

          <h2 className="text-3xl font-bold mt-8 mb-4">Our Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Frontend</h3>
              <ul className="text-gray-700">
                <li>Next.js 14 with App Router</li>
                <li>TypeScript for type safety</li>
                <li>Tailwind CSS for styling</li>
                <li>SWR for data fetching</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Backend</h3>
              <ul className="text-gray-700">
                <li>WordPress as headless CMS</li>
                <li>REST API for content delivery</li>
                <li>Custom post types and fields</li>
                <li>SEO-optimized content structure</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-8 mb-4">Get in Touch</h2>
          <p className="text-gray-700">
            We&apos;d love to hear from you! Whether you have questions, feedback, or just want to say hello, 
            feel free to reach out through our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}