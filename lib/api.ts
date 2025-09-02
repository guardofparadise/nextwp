import axios from 'axios';

// Use WordPress API directly in production, proxy for development
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side - use WordPress API directly in production, proxy in development
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? 'https://wordpress-1406888-5229870.cloudwaysapps.com/wp-json/wp/v2'
      : '/api/wordpress';
    console.log('🔍 Client-side API base URL:', baseUrl);
    return baseUrl;
  } else {
    // Server-side - use WordPress API directly in production, localhost proxy in development
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV;
    const baseUrl = isProduction 
      ? 'https://wordpress-1406888-5229870.cloudwaysapps.com/wp-json/wp/v2'
      : 'http://localhost:3006/api/wordpress';
    console.log('🔍 Server-side API base URL:', baseUrl);
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔍 VERCEL_ENV:', process.env.VERCEL_ENV);
    return baseUrl;
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>[];
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    author?: Array<{
      name: string;
      url: string;
      avatar_urls: {
        '96': string;
      };
    }>;
  };
}

export interface Page {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, unknown>[];
}

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>[];
}

export interface Tag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: Record<string, unknown>[];
}

export interface Media {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
}

export const wpApi = {
  async getPosts(params?: {
    per_page?: number;
    page?: number;
    categories?: string;
    tags?: string;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
    _embed?: boolean;
  }): Promise<{ posts: Post[]; total: number; totalPages: number }> {
    console.log('🚀 wpApi.getPosts called with params:', params);
    console.log('🔗 Axios base URL:', api.defaults.baseURL);
    
    const response = await api.get('/posts', {
      params: {
        per_page: params?.per_page || 10,
        page: params?.page || 1,
        categories: params?.categories,
        tags: params?.tags,
        search: params?.search,
        orderby: params?.orderby || 'date',
        order: params?.order || 'desc',
        _embed: params?._embed !== false,
      },
    });
    
    console.log('✅ wpApi.getPosts response received');
    console.log('📊 Response structure:', {
      isArray: Array.isArray(response.data),
      hasPostsProperty: 'posts' in (response.data || {}),
      dataType: typeof response.data,
      dataLength: Array.isArray(response.data) ? response.data.length : 'Not an array'
    });
    
    // Handle direct WordPress API response (array) vs proxy response (object with posts property)
    if (Array.isArray(response.data)) {
      // Direct WordPress API returns an array
      const total = response.headers['x-wp-total'] ? parseInt(response.headers['x-wp-total']) : response.data.length;
      const totalPages = response.headers['x-wp-totalpages'] ? parseInt(response.headers['x-wp-totalpages']) : 1;
      
      return {
        posts: response.data,
        total,
        totalPages
      };
    } else {
      // Proxy API returns an object
      return response.data;
    }
  },

  async getPost(slug: string): Promise<Post | null> {
    try {
      const response = await api.get(`/posts/${slug}`);
      return response.data.post || null;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },

  async getPostById(id: number): Promise<Post | null> {
    try {
      const response = await api.get(`/posts/${id}`, {
        params: {
          _embed: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      return null;
    }
  },

  async getPages(params?: {
    per_page?: number;
    page?: number;
    parent?: number;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  }): Promise<{ pages: Page[]; total: number; totalPages: number }> {
    const response = await api.get('/pages', {
      params: {
        per_page: params?.per_page || 10,
        page: params?.page || 1,
        parent: params?.parent,
        search: params?.search,
        orderby: params?.orderby || 'menu_order',
        order: params?.order || 'asc',
      },
    });
    
    return {
      pages: response.data,
      total: parseInt(response.headers['x-wp-total'] || '0'),
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '0'),
    };
  },

  async getPage(slug: string): Promise<Page | null> {
    try {
      const response = await api.get('/pages', {
        params: {
          slug,
        },
      });
      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching page:', error);
      return null;
    }
  },

  async getPageById(id: number): Promise<Page | null> {
    try {
      const response = await api.get(`/pages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching page by ID:', error);
      return null;
    }
  },

  async getCategories(params?: {
    per_page?: number;
    page?: number;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
    hide_empty?: boolean;
  }): Promise<Category[]> {
    const response = await api.get('/categories', {
      params: {
        per_page: params?.per_page || 100,
        page: params?.page || 1,
        search: params?.search,
        orderby: params?.orderby || 'name',
        order: params?.order || 'asc',
        hide_empty: params?.hide_empty !== false,
      },
    });
    return response.data;
  },

  async getCategory(slug: string): Promise<Category | null> {
    try {
      const response = await api.get('/categories', {
        params: {
          slug,
        },
      });
      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  },

  async getTags(params?: {
    per_page?: number;
    page?: number;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
    hide_empty?: boolean;
  }): Promise<Tag[]> {
    const response = await api.get('/tags', {
      params: {
        per_page: params?.per_page || 100,
        page: params?.page || 1,
        search: params?.search,
        orderby: params?.orderby || 'name',
        order: params?.order || 'asc',
        hide_empty: params?.hide_empty !== false,
      },
    });
    return response.data;
  },

  async getTag(slug: string): Promise<Tag | null> {
    try {
      const response = await api.get('/tags', {
        params: {
          slug,
        },
      });
      return response.data[0] || null;
    } catch (error) {
      console.error('Error fetching tag:', error);
      return null;
    }
  },

  async getMedia(id: number): Promise<Media | null> {
    try {
      const response = await api.get(`/media/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching media:', error);
      return null;
    }
  },

  async searchPosts(query: string, params?: {
    per_page?: number;
    page?: number;
  }): Promise<{ posts: Post[]; total: number; totalPages: number }> {
    return this.getPosts({
      search: query,
      per_page: params?.per_page,
      page: params?.page,
      _embed: true,
    });
  },
};

export default wpApi;