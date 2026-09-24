import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center" style={{ background: 'var(--background)' }}>
      <div>
        <h1 className="text-7xl font-bold font-mono-data text-rose-500 mb-2">404</h1>
        <h2 className="text-xl font-bold mb-2">Signal Not Found</h2>
        <p className="text-xs text-muted-foreground mb-6">The telemetry stream or dashboard view you requested does not exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Command Center
        </Link>
      </div>
    </div>
  );
}
