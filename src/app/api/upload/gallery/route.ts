import { NextRequest } from 'next/server';
import { handleImageUpload } from '@/server/cloudinary';

export function POST(request: NextRequest) {
  return handleImageUpload(request, { folder: 'gallery', maxWidth: 800, maxHeight: 800 });
}
