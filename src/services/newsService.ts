import { News } from "@/interfaces/News";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const BASE_URL = '/api/news';

// GET all news
export async function getAllNews(): Promise<ApiResponse<News[]>> {
  try {
    const response = await fetch(BASE_URL);
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch news',
    };
  }
}

// GET single news
export async function getNewsById(id: string): Promise<ApiResponse<News>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch news',
    };
  }
}

// POST create news
export async function createNews(news: Omit<News, '_id'>): Promise<ApiResponse<News>> {
  try {
    console.log("Creating news:", news);
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(news),
    });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create news',
    };
  }
}

// PUT update news
export async function updateNews(id: string, news: Omit<News, '_id'>): Promise<ApiResponse<News>> {
  try {
    console.log("Updating news:", news);
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },  
        body: JSON.stringify(news),
      });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update news',
    };
  } 
}

// DELETE news
export async function deleteNews(id: string): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete news',
    };
  }
}