export interface Vacancy {
  _id?: string;
  title: string;
  location: string;
  type: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}