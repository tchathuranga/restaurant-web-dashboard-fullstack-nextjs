import { PromotionProps } from "@/interfaces/promotions";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const BASE_URL = '/api/promotions';

// GET all promotions
export async function getAllPromotions(): Promise<ApiResponse<PromotionProps[]>> {
  try {
    const response = await fetch(`${BASE_URL}`);
    return response.json();
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch promotions",
    };
  }
}

// GET single promotion
export async function getPromotionById(id: string): Promise<ApiResponse<PromotionProps>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  } catch (error) {
    return {
      success: false,
        error: "Failed to fetch promotion",
    };
  }
}

// POST create promotion
export async function createPromotion(promotion: Omit<PromotionProps, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<PromotionProps>> {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promotion),
    });
    return response.json();
  }
    catch (error) { 
    return {
        success: false,
        error: "Failed to create promotion",
      };
  }
}

// DELETE promotion
export async function deletePromotion(id: string): Promise<ApiResponse<PromotionProps>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error) {
    return {
      success: false,
      error: "Failed to delete promotion",
    };
  }
}