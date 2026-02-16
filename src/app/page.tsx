import { CreatePollForm } from "@/components/CreatePollForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Zap, Share2 } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="text-center py-20 lg:py-32">
        <div className="container">
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">Create Real-time Polls in Seconds</h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-muted-foreground">
            The simplest way to gather opinions. Create a poll, share the link, and watch the votes roll in live.
          </p>
          <div className="mt-8">
            <a href="#create-poll">
              <Button size="lg" className="text-lg py-6 px-8">
                Create Your First Poll
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card">
         <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Why QuickVote?</h2>
              <p className="text-muted-foreground mt-2">Everything you need for instant feedback.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-primary"/>
                </div>
                <h3 className="text-xl font-semibold">Blazing Fast</h3>
                <p className="text-muted-foreground mt-2">Create and share polls instantly with a simple, no-fuss interface.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg">
                 <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Users className="h-8 w-8 text-primary"/>
                </div>
                <h3 className="text-xl font-semibold">Real-time Updates</h3>
                <p className="text-muted-foreground mt-2">Results update live for everyone. No page refreshes needed.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg">
                 <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Share2 className="h-8 w-8 text-primary"/>
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
