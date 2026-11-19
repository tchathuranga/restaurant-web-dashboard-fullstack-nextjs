import { PromotionProps } from '@/types/promotion';
import { DELETE, jsonBody, request } from '@/services/apiClient';

const BASE_URL = '/api/promotions';

export const getAllPromotions = () => request<PromotionProps[]>(BASE_URL);

export const getPromotionById = (id: string) => request<PromotionProps>(`${BASE_URL}/${id}`);

export const createPromotion = (promotion: Omit<PromotionProps, '_id' | 'createdAt' | 'updatedAt'>) =>
  request<PromotionProps>(BASE_URL, jsonBody('POST', promotion));

export const deletePromotion = (id: string) => request<PromotionProps>(`${BASE_URL}/${id}`, DELETE);
