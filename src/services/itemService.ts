import { IItem, ItemData } from '@/interfaces/Items';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const BASE_URL = '/api/items';

// GET all items
export async function getAllItems(category?: string): Promise<ApiResponse<ItemData[]>> {
  try {
    const url = category && category !== 'All' ? `${BASE_URL}?category=${category}` : BASE_URL;
    const response = await fetch(url);
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch items',
    };
  }
}

// GET single item
export async function getItemById(id: string): Promise<ApiResponse<IItem>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch item',
    };
  }
}

// POST create item
export async function createItem(item: Omit<IItem, '_id'>): Promise<ApiResponse<IItem>> {
  try {
    console.log("Creating item:", item);
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create item',
    };
  }
}

// PUT update item
export async function updateItem(id: string, item: Partial<IItem>): Promise<ApiResponse<IItem>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update item',
    };
  }
}

// DELETE item
export async function deleteItem(id: string): Promise<ApiResponse<IItem>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete item',
    };
  }
}
