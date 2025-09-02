import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WordPressHeader from "@/components/WordPressHeader";
import WordPressFooter from "@/components/WordPressFooter";
import ElementorStyles from "@/components/ElementorStyles";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WordPress Next.js Blog",
  description: "A professional blog powered by WordPress headless CMS and Next.js",
  keywords: "blog, wordpress, nextjs, headless cms",
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "WordPress Next.js Blog",
    description: "A professional blog powered by WordPress headless CMS and Next.js",
    type: "website",
    locale: "en_US",
    siteName: "Vlad Headless CMS",
  },
  twitter: {
    card: "summary_large_image",
    title: "WordPress Next.js Blog",
    description: "A professional blog powered by WordPress headless CMS and Next.js",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ElementorStyles />
        <div className="min-h-screen flex flex-col">
          <WordPressHeader />
          <main className="flex-grow">
            {children}
          </main>
          <WordPressFooter />
        </div>
      </body>
    </html>
  );
}
