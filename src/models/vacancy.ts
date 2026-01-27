import mongoose from 'mongoose';
import { Vacancy } from '@/interfaces/vacancy';

const VacancySchema = new mongoose.Schema<Vacancy>({
  title: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
}, {
  timestamps: true
});

export default mongoose.models.Vacancy || mongoose.model<Vacancy>('Vacancy', VacancySchema);