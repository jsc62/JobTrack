import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import { ApplicationsProvider } from '@/hooks/use-applications';

export const metadata = {
  title: 'Job Tracker',
  description: 'A simple job tracker for junior developers.',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ApplicationsProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ApplicationsProvider>
      </body>
    </html>
  );
}
