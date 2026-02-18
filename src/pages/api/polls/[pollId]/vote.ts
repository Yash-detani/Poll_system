import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import PollModel from '@/lib/models/poll';
import VoteModel from '@/lib/models/vote';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

const getIp = (req: NextApiRequest) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress;
};

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    const { pollId } = req.query;
    const { optionId, voterId } = req.body;
    const ip = getIp(req);

    if (!pollId || !optionId || !ip || !voterId) {
      return res.status(400).json({ message: 'Missing pollId, optionId, voterId, or IP address.' });
    }

    // 1. Record the vote FIRST to prevent race conditions (duplicate votes)
    // The unique index on { pollId, voterId } will throw an error if this exists
    try {
      await VoteModel.create({ pollId, voterId, ip });
    } catch (error: any) {
      if (error.code === 11000) { // MongoDB duplicate key error
        return res.status(403).json({ message: 'You have already voted on this poll.' });
      }
      throw error; // Re-throw other errors
    }

    // 2. Atomically update the poll count
    const poll = await PollModel.findOneAndUpdate(
      { pollId, 'options._id': optionId },
      { $inc: { 'options.$.votes': 1 } },
      { new: true }
    );

    if (!poll) {
      // Rollback vote if poll/option doesn't exist (clean up orphan vote)
      await VoteModel.deleteOne({ pollId, voterId });
      return res.status(404).json({ message: 'Poll or option not found.' });
    }

    // 3. Emit real-time update
    const io = res.socket.server.io;
    if (io) {
      io.emit('vote:update', poll);
    }

    res.status(200).json(poll);
  } catch (error: any) {
    console.error('Error processing vote:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
