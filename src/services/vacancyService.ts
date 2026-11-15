import { Vacancy } from '@/types/vacancy';
import { DELETE, jsonBody, request } from '@/services/apiClient';

const BASE_URL = '/api/vacancy';

export const getAllVacancies = () => request<Vacancy[]>(BASE_URL);

export const getVacancyById = (id: string) => request<Vacancy>(`${BASE_URL}/${id}`);

export const createVacancy = (vacancy: Omit<Vacancy, '_id'>) =>
  request<Vacancy>(BASE_URL, jsonBody('POST', vacancy));

export const updateVacancy = (id: string, vacancy: Omit<Vacancy, '_id'>) =>
  request<Vacancy>(`${BASE_URL}/${id}`, jsonBody('PUT', vacancy));

export const deleteVacancy = (id?: string) => request<Vacancy>(`${BASE_URL}/${id}`, DELETE);
