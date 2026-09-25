import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/context/toast-context';

export const metadata: Metadata = {
  title: 'Veltrix | AI SaaS Analytics Command Center',
  description: 'See the signal. Understand the story. Enterprise telemetry command center with automated insights and dataset ingestion.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-rose-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
