import Link from 'next/link';
import { PieChart } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Button variant="ghost" size="icon" className="text-primary">
              <PieChart className="h-6 w-6" />
            </Button>
            <span className="hidden sm:inline">Realtime Poll Platform</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
