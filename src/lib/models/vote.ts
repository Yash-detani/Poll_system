import mongoose, { Document, Schema, models } from 'mongoose';

export interface IVote extends Document {
  pollId: string;
  ip: string;
}

const voteSchema = new Schema<IVote>({
  pollId: { type: String, required: true, index: true },
  ip: { type: String, required: true },
}, { timestamps: true });

voteSchema.index({ pollId: 1, ip: 1 }, { unique: true });

const VoteModel = models.Vote || mongoose.model<IVote>('Vote', voteSchema);

export default VoteModel as mongoose.Model<IVote>;
