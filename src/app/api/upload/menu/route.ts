import { NextRequest } from 'next/server';
import { handleImageUpload } from '@/server/cloudinary';

// Menu images are filed under the dish's category, which the form sends alongside the file
export function POST(request: NextRequest) {
  return handleImageUpload(request, {
    folder: (formData) => {
      const category = formData.get('category');
      return typeof category === 'string' && category ? category : null;
    },
    missingFolderError: 'No category provided',
    maxWidth: 800,
    maxHeight: 800,
  });
}
