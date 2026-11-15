import { uploadImage } from '@/services/apiClient';

export const uploadMenuImageToCloudinary = (file: File, category: string) =>
  uploadImage('/api/upload/menu', file, { category });

export const uploadNewsImageToCloudinary = (file: File) => uploadImage('/api/upload/news', file);

export const uploadGalleryImageToCloudinary = (file: File) => uploadImage('/api/upload/gallery', file);

export const uploadPromotionsImageToCloudinary = (file: File) => uploadImage('/api/upload/promotions', file);

export const uploadBannerImage = (file: File) => uploadImage('/api/upload/banners', file);
