import { News } from '@/types/news';
import { DELETE, jsonBody, request } from '@/services/apiClient';

const BASE_URL = '/api/news';

export const getAllNews = () => request<News[]>(BASE_URL);

export const getNewsById = (id: string) => request<News>(`${BASE_URL}/${id}`);

export const createNews = (news: Omit<News, '_id'>) => request<News>(BASE_URL, jsonBody('POST', news));

export const updateNews = (id: string, news: Omit<News, '_id'>) =>
  request<News>(`${BASE_URL}/${id}`, jsonBody('PUT', news));

export const deleteNews = (id: string) => request<null>(`${BASE_URL}/${id}`, DELETE);
