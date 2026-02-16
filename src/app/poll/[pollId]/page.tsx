import { notFound } from 'next/navigation';
import PollPageClient from '@/components/PollPageClient';
import PollModel from '@/lib/models/poll';
import dbConnect from '@/lib/db';
import type { Poll } from '@/types';

async function getPoll(pollId: string): Promise<Poll | null> {
  try {
    await dbConnect();
    const poll = await PollModel.findOne({ pollId }).lean();
    if (!poll) {
      return null;
    }
    // Mongoose documents are not plain objects, so we need to serialize
    return JSON.parse(JSON.stringify(poll));
  } catch (error) {
    console.error("Failed to fetch poll", error);
    return null;
  }
}

export default async function PollPage({ params }: { params: { pollId: string } }) {
  const poll = await getPoll(params.pollId);

  if (!poll) {
    notFound();
  }

  return <PollPageClient initialPoll={poll} />;
}

export async function generateMetadata({ params }: { params: { pollId: string } }) {
  const poll = await getPoll(params.pollId);
  return {
    title: poll ? `${poll.question} | QuickVote` : 'Poll Not Found',
  };
}
