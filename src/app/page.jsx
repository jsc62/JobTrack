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
  const [st, setSt] = useState('');
  const [sf, setSf] = useState('All');

  useEffect(() => {
    console.log('applications updated', applications);
  }, [applications]);

  var filtered_apps = [];
  if (applications) {
    for (var i = 0; i < applications.length; i++) {
      var app = applications[i];
      if (sf !== 'All' && app.status !== sf) {
        // do nothing
      } else {
        if (st === '') {
          filtered_apps.push(app);
        } else {
          var lowercasedTerm = st.toLowerCase();
          if (
            app.company.toLowerCase().includes(lowercasedTerm) ||
            app.jobTitle.toLowerCase().includes(lowercasedTerm)
          ) {
            filtered_apps.push(app);
          }
        }
      }
    }
  }

  filtered_apps.sort(
    (a, b) =>
      new Date(b.applicationDate).getTime() -
      new Date(a.applicationDate).getTime()
  );

  const kanbanStatuses = [
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
        {loading === true ? (
          <p>Loading board...</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {kanbanStatuses.map((status) => {
              const appsInStatus = [];
              for (let i = 0; i < applications.length; i++) {
                if (applications[i].status === status) {
                  appsInStatus.push(applications[i]);
                }
              }

              return (
                <div
                  key={status}
                  className="w-80 flex-shrink-0 rounded-lg bg-secondary/20 p-2"
                >
                  <h3 className="flex items-center justify-between px-4 py-2 text-lg font-semibold">
                    {status}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-sm font-normal text-secondary-foreground">
                      {appsInStatus.length}
                    </span>
                  </h3>
                  <div className="space-y-2 p-2">
                    {appsInStatus.length > 0 ? (
                      appsInStatus.map((app) => (
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
              value={st}
              onChange={(e) => setSt(e.target.value)}
            />
          </div>
          <Select value={sf} onValueChange={(value) => setSf(value)}>
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
          ) : filtered_apps.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered_apps.map((app) => (
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
