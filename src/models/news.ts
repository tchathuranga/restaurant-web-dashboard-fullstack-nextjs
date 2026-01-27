import mongoose from 'mongoose';
import { News } from '@/interfaces/News';

const NewsSchema = new mongoose.Schema<News>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
}, {
    timestamps: true
});

export default mongoose.models.News || mongoose.model<News>('News', NewsSchema);