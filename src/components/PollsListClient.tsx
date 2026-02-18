"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BarChart2, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { type Poll } from "@/types";
import io, { Socket } from 'socket.io-client';

interface PollsListClientProps {
    initialPolls: Poll[];
}

export function PollsListClient({ initialPolls }: PollsListClientProps) {
    const [polls, setPolls] = useState<Poll[]>(initialPolls);

    useEffect(() => {
        let socketInstance: Socket | null = null;

        const initSocket = async () => {
            // Ensure the socket server is initialized
            await fetch('/api/socket');

            const socket: Socket = io({
                path: '/api/socket',
                reconnectionAttempts: 10,
                reconnectionDelay: 2000,
            });

            socket.on('vote:update', (updatedPoll: Poll) => {
                setPolls(prevPolls =>
                    prevPolls.map(p => p.pollId === updatedPoll.pollId ? updatedPoll : p)
                );
            });

            socket.on('polls:refreshed', async () => {
                try {
                    const res = await fetch('/api/polls');
                    if (res.ok) {
                        const freshPolls = await res.json();
                        setPolls(freshPolls);
                    }
                } catch (error) {
                    console.error('Failed to refresh polls list:', error);
                }
            });

            socketInstance = socket;
        };

        initSocket();

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => {
                const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);
                return (
                    <Card key={poll.pollId} className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="line-clamp-2 text-xl">{poll.question}</CardTitle>
                            <CardDescription>{new Date(poll.createdAt!).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <BarChart2 className="w-4 h-4" />
                                <span>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full" variant="secondary">
                                <Link href={`/poll/${poll.pollId}`}>
                                    Vote Now <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
