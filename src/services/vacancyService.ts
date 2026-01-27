import { Vacancy } from "@/interfaces/vacancy";

export interface VacancyApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const BASE_URL = '/api/vacancy';

// GET all vacancies
export async function getAllVacancies(): Promise<VacancyApiResponse<Vacancy[]>> {
  try {
    const response = await fetch(BASE_URL);
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch vacancies',
    };
  } 
}

// GET single vacancy
export async function getVacancyById(id: string): Promise<VacancyApiResponse<Vacancy>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch vacancy',
    };
  }
}

// POST create vacancy
export async function createVacancy(vacancy: Omit<Vacancy, '_id'>): Promise<VacancyApiResponse<Vacancy>> {
  try {
    console.log("Creating vacancy:", vacancy);
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vacancy),
    });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to create vacancy',
    };
  }
}

// PUT update vacancy
export async function updateVacancy(id: string, vacancy: Omit<Vacancy, '_id'>): Promise<VacancyApiResponse<Vacancy>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vacancy),
    });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to update vacancy',
    };
  }
}

// DELETE vacancy
export async function deleteVacancy(id?: string): Promise<VacancyApiResponse<Vacancy>> {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to delete vacancy',
    };
  }
}