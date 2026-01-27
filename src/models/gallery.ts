import mongoose from 'mongoose';
import { IGallery } from '@/interfaces/gallery';

const GallerySchema = new mongoose.Schema<IGallery>(
    {
        image: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);