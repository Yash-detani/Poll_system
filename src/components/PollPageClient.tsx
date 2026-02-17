"use client";

import { useState, useEffect, useMemo } from 'react';
import { type Poll } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Share2, Check, Loader2 } from 'lucide-react';
import io, { Socket } from 'socket.io-client';

interface PollPageClientProps {
  initialPoll: Poll;
}

export default function PollPageClient({ initialPoll }: PollPageClientProps) {
  const [poll, setPoll] = useState<Poll>(initialPoll);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const totalVotes = useMemo(() => {
    return poll.options.reduce((acc, option) => acc + option.votes, 0);
  }, [poll]);

  useEffect(() => {
    // Check localStorage for previous vote
    const voted = localStorage.getItem(`voted_poll_${poll.pollId}`);
    if (voted) {
      setHasVoted(true);
    }

    // Initialize Socket.IO connection
    const socket: Socket = io({ path: '/api/socket' });

    socket.on('connect', () => {
      socket.emit('join:poll', poll.pollId);
    });

    socket.on('vote:update', (updatedPoll: Poll) => {
      setPoll(updatedPoll);
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, [poll.pollId]);

  const handleVote = async () => {
    if (!selectedOption) {
      toast({ title: 'Please select an option to vote.', variant: 'destructive' });
      return;
    }

    setIsVoting(true);

    try {
      const res = await fetch(`/api/polls/${poll.pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: selectedOption }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to cast vote.');
      }

      setHasVoted(true);
      localStorage.setItem(`voted_poll_${poll.pollId}`, 'true');
      toast({
        title: 'Vote Cast!',
        description: 'Your vote has been successfully recorded.',
        className: 'bg-green-600 text-white',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      if (error.message.includes("already voted")) {
        setHasVoted(true);
        localStorage.setItem(`voted_poll_${poll.pollId}`, 'true');
      }
    } finally {
      setIsVoting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ description: 'Poll link copied to clipboard!' });
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:py-12 lg:py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-center">{poll.question}</CardTitle>
            <CardDescription className="text-center pt-2">
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''} so far.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {poll.options.map(option => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                return (
                  <div key={option._id}>
                    {hasVoted ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm font-medium">
                          <span>{option.text}</span>
                          <span>{`${percentage.toFixed(1)}% (${option.votes})`}</span>
                        </div>
                        <Progress value={percentage} />
                      </div>
                    ) : (
                      <Button
                        variant={selectedOption === option._id ? 'default' : 'outline'}
                        className="w-full justify-start p-6 text-base"
                        onClick={() => setSelectedOption(option._id)}
                      >
                        {option.text}
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
            {!hasVoted && (
              <Button onClick={handleVote} disabled={!selectedOption || isVoting} className="w-full mt-6 py-6 text-lg">
                {isVoting ? <Loader2 className="animate-spin" /> : 'Cast My Vote'}
              </Button>
            )}
            {hasVoted && (
              <div className="mt-6 text-center text-green-700 bg-green-100 p-4 rounded-md flex items-center justify-center gap-2 dark:bg-green-900/50 dark:text-green-300">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">You have voted on this poll.</p>
              </div>
            )}
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="secondary" className="w-full" onClick={copyLink} disabled={isCopied}>
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" /> Copy Share Link
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
