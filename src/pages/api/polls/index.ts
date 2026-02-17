import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import PollModel from '@/lib/models/poll';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await dbConnect();

        const polls = await PollModel.find({}).sort({ createdAt: -1 });

        res.status(200).json(polls);
    } catch (error) {
        console.error('Error fetching polls:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
