"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApplications } from '@/hooks/use-applications';
import { ApplicationCard } from '@/components/application-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Search } from 'lucide-react';

export default function Home() {
  const { applications, loading } = useApplications();
  const [sokeTerm, setSokeTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filtrer søknader basert på søketekst og statusfilter
  const filtrerteSoknader = applications
    .filter((app) => {
      if (statusFilter !== 'All' && app.status !== statusFilter) return false;
      if (!sokeTerm) return true;
      const term = sokeTerm.toLowerCase();
      return (
        app.company.toLowerCase().includes(term) ||
        app.jobTitle.toLowerCase().includes(term)
      );
    })
    .sort(
      (a, b) =>
        new Date(b.applicationDate).getTime() -
        new Date(a.applicationDate).getTime()
    );

  const kanbanStatuser = [
    'Applied',
    'Interviewing',
    'Offer',
    'Rejected',
    'Follow-up Sent',
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          My Job Applications
        </h1>
        <Link href="/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Application
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Kanban Board</h2>
        {loading ? (
          <p>Loading board...</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanStatuser.map((status) => {
              const soknaderMedStatus = applications.filter(
                (app) => app.status === status
              );

              return (
                <div
                  key={status}
                  className="w-80 flex-shrink-0 rounded-lg bg-secondary/20 p-2"
                >
                  <h3 className="flex items-center justify-between px-4 py-2 text-lg font-semibold">
                    {status}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-sm font-normal text-secondary-foreground">
                      {soknaderMedStatus.length}
                    </span>
                  </h3>
                  <div className="space-y-2 p-2">
                    {soknaderMedStatus.length > 0 ? (
                      soknaderMedStatus.map((app) => (
                        <ApplicationCard key={app.id} application={app} />
                      ))
                    ) : (
                      <div className="flex items-center justify-center rounded-md border-2 border-dashed py-10 text-center">
                        <p className="text-sm text-muted-foreground">
                          No applications here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-8 border-t pt-8">
        <h2 className="mb-4 text-xl font-bold">All Applications</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by company or title..."
              className="pl-10"
              value={sokeTerm}
              onChange={(e) => setSokeTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Follow-up Sent">Follow-up Sent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8">
          {loading ? (
            <p>Loading applications...</p>
          ) : filtrerteSoknader.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtrerteSoknader.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed py-16 text-center">
              <h2 className="text-xl font-semibold">No applications found</h2>
              <p className="mt-2 text-muted-foreground">
                Get started by adding your first job application.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
