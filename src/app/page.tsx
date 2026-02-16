import { CreatePollForm } from "@/components/CreatePollForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Vote } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4 sm:py-12 lg:py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
              <Vote className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Create a New Poll</CardTitle>
            <CardDescription className="text-lg">
              Instantly create a poll and share it with your friends, colleagues, or community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreatePollForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
