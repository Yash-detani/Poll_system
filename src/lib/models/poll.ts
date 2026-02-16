import mongoose, { Document, Schema, models } from 'mongoose';
import { Poll } from '@/types';

const optionSchema = new Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const pollSchema = new Schema<Poll>({
  pollId: { type: String, required: true, unique: true, index: true },
  question: { type: String, required: true },
  options: [optionSchema],
}, { timestamps: true });

const PollModel = models.Poll || mongoose.model<Poll>('Poll', pollSchema);

export default PollModel as mongoose.Model<Poll>;
