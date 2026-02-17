import { CreatePollForm } from "@/components/CreatePollForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, Zap, Share2, BarChart2, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { type Poll } from "@/types";

async function getPolls(): Promise<Poll[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/polls`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    return [];
  }
  return res.json();
}

export default async function Home() {
  const polls = await getPolls();

  return (
    <>
      <section className="text-center py-20 lg:py-32">
        <div className="container">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">Create Real-time Polls in Seconds</h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
            The simplest way to gather opinions. Create a poll, share the link, and watch the votes roll in live.
          </p>
          <div className="mt-8">
            <Button size="lg" asChild className="text-lg py-6 px-8">
              <a href="#create-poll">
                Create Poll
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Polls Section */}
      {polls.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tight">Recent Polls</h2>
              <p className="text-muted-foreground mt-2">Check out the latest polls created by the community.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          </div>
        </section>
      )}

      <section className="py-16 lg:py-24 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Why QuickVote?</h2>
            <p className="text-muted-foreground mt-2">Everything you need for instant feedback.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Blazing Fast</h3>
              <p className="text-muted-foreground mt-2">Create and share polls instantly with a simple, no-fuss interface.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Updates</h3>
              <p className="text-muted-foreground mt-2">Results update live for everyone. No page refreshes needed.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Share Anywhere</h3>
              <p className="text-muted-foreground mt-2">Every poll gets a unique, shareable link that works on any device.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="create-poll" className="py-16 lg:py-24 scroll-mt-20">
        <div className="container max-w-2xl mx-auto">
          <Card className="shadow-lg border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold tracking-tight">Get Started</CardTitle>
              <CardDescription className="text-lg">
                Fill out the form below and share your poll with the world.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreatePollForm />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
