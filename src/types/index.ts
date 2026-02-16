import { Document } from 'mongoose';

export interface Option {
  _id: string;
  text: string;
  votes: number;
}

export interface Poll extends Document {
  _id: string;
  pollId: string;
  question: string;
  options: Option[];
  createdAt: Date;
  updatedAt: Date;
}
