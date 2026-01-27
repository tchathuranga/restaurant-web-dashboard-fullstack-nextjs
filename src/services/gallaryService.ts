import { IGallery } from "@/interfaces/gallery";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const BASE_URL = '/api/gallery';
// GET all gallery items
export async function getAllGalleryItems(): Promise<ApiResponse<IGallery[]>> {
  try {
    const response = await fetch(BASE_URL);
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch gallery items',
    };
  }
}

// GET single gallery item
export async function getGalleryItemById(id: string): Promise<ApiResponse<IGallery>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch gallery item',
    };
  } 
}

// POST create gallery item
export async function createGalleryItem(galleryItem: Omit<IGallery, '_id'>): Promise<ApiResponse<IGallery>> {
  try {
    console.log("Creating gallery item:", galleryItem);
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(galleryItem),
    });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create gallery item',
    };
  }
}

// DELETE gallery item
export async function deleteGalleryItem(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete gallery item',
    };
  }
}