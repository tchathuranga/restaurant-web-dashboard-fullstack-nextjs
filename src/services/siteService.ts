import { IBranch } from '@/interfaces/branch';
import { UploadResponse } from '@/services/uploadService';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, init);
    return await response.json();
  } catch (error: any) {
    return { success: false, error: error.message || 'Request failed' };
  }
}

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

// Banners
export const getBanners = () => request<Record<string, string[]>>('/api/banners');

export const saveBanner = (page: string, images: string[]) =>
  request<unknown>('/api/banners', json('PUT', { page, images }));

export async function uploadBannerImage(file: File): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload/banners', { method: 'POST', body: formData });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Upload failed' };
    }
    return { success: true, url: data.url };
  } catch (error: any) {
    return { success: false, error: error.message || 'Upload failed' };
  }
}

// Branches
export const getBranches = () => request<IBranch[]>('/api/branches');

export const createBranch = (branch: Omit<IBranch, '_id'>) =>
  request<IBranch>('/api/branches', json('POST', branch));

export const updateBranch = (id: string, branch: Partial<IBranch>) =>
  request<IBranch>(`/api/branches/${id}`, json('PUT', branch));

export const deleteBranch = (id: string) =>
  request<IBranch>(`/api/branches/${id}`, { method: 'DELETE' });

export const importDefaultBranches = () =>
  request<IBranch[]>('/api/branches/import-defaults', { method: 'POST' });
