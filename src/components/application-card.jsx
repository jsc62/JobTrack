"use client";

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { statuses } from '@/lib/types';
import { useApplications } from '@/hooks/use-applications';
import { formatDistanceToNow } from 'date-fns';

export function ApplicationCard({ application }) {
  const { updateApplicationStatus } = useApplications();

  const handleStatusChange = (newStatus) => {
    updateApplicationStatus(application.id, newStatus);
  };

  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Offer':
        return 'default';
      case 'Interviewing':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      case 'Applied':
      case 'Follow-up Sent':
      default:
        return 'outline';
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="pr-2 text-lg font-semibold hover:text-primary">
            <Link href={`/applications/${application.id}`}>
              {application.jobTitle}
            </Link>
          </CardTitle>
          <Badge variant={getBadgeVariant(application.status)}>
            {application.status}
          </Badge>
        </div>
        <CardDescription>{application.company}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          Applied{' '}
          {formatDistanceToNow(new Date(application.applicationDate), {
            addSuffix: true,
          })}
        </p>
      </CardContent>
      <CardFooter>
        <Select value={application.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Update status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
}
