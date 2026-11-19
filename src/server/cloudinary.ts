import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { errorMessage } from '@/server/http';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface ImageUploadOptions {
  // A fixed Cloudinary folder, or a function that reads it from the submitted form
  folder: string | ((formData: FormData) => string | null);
  missingFolderError?: string;
  resourceType?: UploadApiOptions['resource_type'];
  maxWidth: number;
  maxHeight?: number;
}

function uploadBuffer(buffer: Buffer, options: UploadApiOptions): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error || !result) reject(error ?? new Error('Upload failed'));
        else resolve(result);
      })
      .end(buffer);
  });
}

// Shared body of every /api/upload/* route: read the file from the form, send it to Cloudinary, return its URL
export async function handleImageUpload(request: NextRequest, options: ImageUploadOptions) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const folder = typeof options.folder === 'function' ? options.folder(formData) : options.folder;
    if (!folder) {
      return NextResponse.json({ error: options.missingFolderError ?? 'No folder provided' }, { status: 400 });
    }

    const result = await uploadBuffer(Buffer.from(await file.arrayBuffer()), {
      folder,
      resource_type: options.resourceType ?? 'auto',
      transformation: [
        { width: options.maxWidth, height: options.maxHeight, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return NextResponse.json({ success: true, url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: errorMessage(error, 'Upload failed') }, { status: 500 });
  }
}
