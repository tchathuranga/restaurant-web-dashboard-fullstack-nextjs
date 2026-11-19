import { IBranch } from '@/types/branch';
import { DELETE, jsonBody, request } from '@/services/apiClient';

export { uploadBannerImage } from '@/services/uploadService';

// Banners
export const getBanners = () => request<Record<string, string[]>>('/api/banners');

export const saveBanner = (page: string, images: string[]) =>
  request<unknown>('/api/banners', jsonBody('PUT', { page, images }));

// Branches
export const getBranches = () => request<IBranch[]>('/api/branches');

export const createBranch = (branch: Omit<IBranch, '_id'>) =>
  request<IBranch>('/api/branches', jsonBody('POST', branch));

export const updateBranch = (id: string, branch: Partial<IBranch>) =>
  request<IBranch>(`/api/branches/${id}`, jsonBody('PUT', branch));

export const deleteBranch = (id: string) => request<IBranch>(`/api/branches/${id}`, DELETE);

export const importDefaultBranches = () =>
  request<IBranch[]>('/api/branches/import-defaults', { method: 'POST' });
