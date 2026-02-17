import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO, Socket } from 'socket.io';
import { Poll } from '@/types';
import dbConnect from '@/lib/db';
import PollModel from '@/lib/models/poll';

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket: Socket) => {
      socket.on('join:poll', (pollId: string) => {
        if (pollId) {
          socket.join(pollId);
        }
      });
    });

    // Setup Change Streams for real-time DB sync
    try {
      const db = await dbConnect();
      const pollCollection = PollModel.collection;

      const changeStream = pollCollection.watch([], { fullDocument: 'updateLookup' });

      changeStream.on('change', (next) => {
        if (next.operationType === 'delete') {
          // Note: In a real 'delete' event, next.documentKey._id contains the deleted ID.
          // However, we identify polls by 'pollId' (nanoid), not MongoDB _id.
          // This is tricky for direct deletions.
          // If we had the pollId, we would: io.to(pollId).emit('poll:deleted', pollId);
          // For now, we'll emit a generic 'refresh' or try to match if possible.
          io.emit('polls:refreshed');
        } else if (next.operationType === 'insert' || next.operationType === 'update') {
          io.emit('polls:refreshed');
        }
      });

      console.log('MongoDB Change Stream initialized');
    } catch (error) {
      console.error('Failed to initialize Change Stream:', error);
    }

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
