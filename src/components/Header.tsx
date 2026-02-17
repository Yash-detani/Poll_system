import Link from 'next/link';
import { PieChart } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b bg-card sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="h-10 w-10 flex items-center justify-center rounded-md transition-colors hover:bg-accent text-primary">
              <PieChart className="h-6 w-6" />
            </div>
            <span className="hidden sm:inline text-foreground">QuickVote</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
