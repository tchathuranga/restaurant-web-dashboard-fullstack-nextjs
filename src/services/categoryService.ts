import { ICategory } from '@/types/category';
import { DELETE, jsonBody, request } from '@/services/apiClient';

export const getCategories = () => request<ICategory[]>('/api/categories');

export const createCategory = (name: string) => request<unknown>('/api/categories', jsonBody('POST', { name }));

export const renameCategory = (id: string, name: string) =>
  request<unknown>(`/api/categories/${id}`, jsonBody('PUT', { name }));

export const deleteCategory = (id: string) => request<unknown>(`/api/categories/${id}`, DELETE);

export const createSubcategory = (categoryId: string, name: string) =>
  request<unknown>(`/api/categories/${categoryId}/subcategories`, jsonBody('POST', { name }));

export const renameSubcategory = (id: string, name: string) =>
  request<unknown>(`/api/subcategories/${id}`, jsonBody('PUT', { name }));

export const deleteSubcategory = (id: string) => request<unknown>(`/api/subcategories/${id}`, DELETE);
