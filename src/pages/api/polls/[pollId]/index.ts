import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import PollModel from '@/lib/models/poll';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    const { pollId } = req.query;

    const poll = await PollModel.findOne({ pollId }).lean();

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.status(200).json(poll);
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
