import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-primary"
        >
          <Briefcase className="h-6 w-6" />
          <span>Job Tracker</span>
        </Link>
      </div>
    </header>
  );
}
