import { ApiResponse, UploadResponse } from '@/types/api';

function messageOf(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

// Calls an /api route and returns its envelope. Network failures become a failed envelope instead of throwing.
export async function request<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, init);
    return await response.json();
  } catch (error) {
    return { success: false, error: messageOf(error, 'Request failed') };
  }
}

export const jsonBody = (method: 'POST' | 'PUT', body: unknown): RequestInit => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const DELETE: RequestInit = { method: 'DELETE' };

// Sends one image to an /api/upload/* route; extra fields travel in the same form
export async function uploadImage(
  url: string,
  file: File,
  fields: Record<string, string> = {}
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    for (const [key, value] of Object.entries(fields)) formData.append(key, value);

    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Upload failed' };
    }
    return { success: true, url: data.url };
  } catch (error) {
    return { success: false, error: messageOf(error, 'Upload failed') };
  }
}
