import useSWR from 'swr';
import { wpApi, Post, Page, Category, Tag } from './api';

export function usePosts(params?: Parameters<typeof wpApi.getPosts>[0]) {
  const key = params ? ['posts', params] : 'posts';
  
  return useSWR(key, () => wpApi.getPosts(params), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}

export function usePost(slug: string) {
  return useSWR(
    slug ? ['post', slug] : null,
    () => wpApi.getPost(slug),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}

export function usePages(params?: Parameters<typeof wpApi.getPages>[0]) {
  const key = params ? ['pages', params] : 'pages';
  
  return useSWR(key, () => wpApi.getPages(params), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}

export function usePage(slug: string) {
  return useSWR(
    slug ? ['page', slug] : null,
    () => wpApi.getPage(slug),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
}

export function useCategories(params?: Parameters<typeof wpApi.getCategories>[0]) {
  const key = params ? ['categories', params] : 'categories';
  
  return useSWR(key, () => wpApi.getCategories(params), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}

export function useTags(params?: Parameters<typeof wpApi.getTags>[0]) {
  const key = params ? ['tags', params] : 'tags';
  
  return useSWR(key, () => wpApi.getTags(params), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
}