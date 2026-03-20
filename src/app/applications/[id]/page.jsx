"use client";

import { useParams, useRouter } from 'next/navigation';
import { useApplications } from '@/hooks/use-applications';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, History, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function ApplicationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { getApplicationById } = useApplications();

  const [soknad, setSoknad] = useState(undefined);
  const [laster, setLaster] = useState(true);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      const funnet = getApplicationById(id);
      setSoknad(funnet);
    }
    setLaster(false);
  }, [id, getApplicationById]);

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Offer':       return 'default';
      case 'Interviewing': return 'secondary';
      case 'Rejected':    return 'destructive';
      default:            return 'outline';
    }
  };

  if (laster) {
    return (
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <Skeleton className="mb-8 h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!soknad) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Application not found</h1>
        <Button onClick={() => router.push('/')} className="mt-4">
          Go Back Home
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to list
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">
                {soknad.jobTitle}
              </CardTitle>
              <CardDescription className="text-lg">
                {soknad.company}
              </CardDescription>
            </div>
            <Badge
              variant={getBadgeVariant(soknad.status)}
              className="h-fit w-fit text-base"
            >
              {soknad.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="font-semibold text-muted-foreground">Application Date</p>
              <p>{format(new Date(soknad.applicationDate), 'PPP')}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">Job Posting</p>
              {soknad.url ? (
                <a
                  href={soknad.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  View Link <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <p>No URL provided</p>
              )}
            </div>
          </div>

          {soknad.notes && (
            <div>
              <p className="font-semibold text-muted-foreground">Notes</p>
              <p className="whitespace-pre-wrap rounded-md bg-secondary/30 p-3">
                {soknad.notes}
              </p>
            </div>
          )}

          {/* Historikk over statusendringer */}
          <div>
            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold">
              <History className="h-5 w-5" /> Status History
            </h3>
            <ul className="ml-1 space-y-2 border-l-2 pl-4">
              {soknad.history
                .slice()
                .reverse()
                .map((hendelse, index) => (
                  <li key={index} className="relative">
                    <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full border-2 border-background bg-border"></span>
                    <p className="font-medium">{hendelse.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(hendelse.timestamp), 'PPpp')}
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="bg-secondary/20 p-6" />
      </Card>
    </div>
  );
}
