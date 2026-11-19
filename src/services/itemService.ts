import { IItem, ItemData } from '@/types/item';
import { DELETE, jsonBody, request } from '@/services/apiClient';

const BASE_URL = '/api/items';

export const getAllItems = (category?: string) =>
  request<ItemData[]>(category && category !== 'All' ? `${BASE_URL}?category=${category}` : BASE_URL);

export const getItemById = (id: string) => request<IItem>(`${BASE_URL}/${id}`);

export const createItem = (item: Omit<IItem, '_id'>) => request<IItem>(BASE_URL, jsonBody('POST', item));

export const updateItem = (id: string, item: Partial<IItem>) =>
  request<IItem>(`${BASE_URL}/${id}`, jsonBody('PUT', item));

export const deleteItem = (id: string) => request<IItem>(`${BASE_URL}/${id}`, DELETE);
