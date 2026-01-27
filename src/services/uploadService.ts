export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export const uploadMenuImageToCloudinary = async (
  file: File,
  category: string
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const response = await fetch('/api/upload/menu', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Upload failed',
      };
    }

    return {
      success: true,
      url: data.url,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
};

export const uploadNewsImageToCloudinary = async (
  file: File,
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/news', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Upload failed',
      };
    }

    return {
      success: true,
      url: data.url,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Upload failed',
    };
  }
};