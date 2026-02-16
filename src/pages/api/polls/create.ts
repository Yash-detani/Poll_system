import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import dbConnect from '@/lib/db';
import PollModel from '@/lib/models/poll';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    const { question, options } = req.body;

    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Invalid poll data. Question and at least two options are required.' });
    }

    const pollId = nanoid(10);
    const newPoll = new PollModel({
      pollId,
      question,
      options: options.map((text: string) => ({ text, votes: 0 })),
    });

    await newPoll.save();

    res.status(201).json({ pollId });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
