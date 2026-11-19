import { IGallery } from '@/types/gallery';
import { DELETE, jsonBody, request } from '@/services/apiClient';

const BASE_URL = '/api/gallery';

export const getAllGalleryItems = () => request<IGallery[]>(BASE_URL);

export const getGalleryItemById = (id: string) => request<IGallery>(`${BASE_URL}/${id}`);

export const createGalleryItem = (galleryItem: Omit<IGallery, '_id'>) =>
  request<IGallery>(BASE_URL, jsonBody('POST', galleryItem));

export const deleteGalleryItem = (id: string) => request<IGallery>(`${BASE_URL}/${id}`, DELETE);
