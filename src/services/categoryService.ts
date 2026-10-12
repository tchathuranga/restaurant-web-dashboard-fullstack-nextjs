import { ICategory } from '@/interfaces/Category';
import { ApiResponse } from '@/services/itemService';

async function request<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, init);
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message || 'Request failed' };
  }
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const getCategories = () => request<ICategory[]>('/api/categories');

export const createCategory = (name: string) => request<unknown>('/api/categories', json('POST', { name }));

export const renameCategory = (id: string, name: string) =>
  request<unknown>(`/api/categories/${id}`, json('PUT', { name }));

export const deleteCategory = (id: string) => request<unknown>(`/api/categories/${id}`, json('DELETE'));

export const createSubcategory = (categoryId: string, name: string) =>
  request<unknown>(`/api/categories/${categoryId}/subcategories`, json('POST', { name }));

export const renameSubcategory = (id: string, name: string) =>
  request<unknown>(`/api/subcategories/${id}`, json('PUT', { name }));

export const deleteSubcategory = (id: string) => request<unknown>(`/api/subcategories/${id}`, json('DELETE'));
