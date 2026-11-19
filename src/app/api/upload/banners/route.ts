import { NextRequest } from 'next/server';
import { handleImageUpload } from '@/server/cloudinary';

// Banners are full width, so they keep a larger size than other images
export function POST(request: NextRequest) {
  return handleImageUpload(request, { folder: 'banners', resourceType: 'image', maxWidth: 1920 });
}
