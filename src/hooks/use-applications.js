"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';

const STORAGE_KEY = 'applications';

const ApplicationsContext = createContext(undefined);

export function ApplicationsProvider({ children }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const items = window.localStorage.getItem(STORAGE_KEY);
        if (items) {
          setApplications(JSON.parse(items));
        }
      } catch (error) {
        console.error('Failed to parse applications from localStorage', error);
      }
      setLoading(false);
    }
  }, []);

  const saveApplications = (apps) => {
    try {
      setApplications(apps);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    } catch (error) {
      console.error('Failed to save applications to localStorage', error);
    }
  };

  const addApplication = (app) => {
    const newApp = {
      ...app,
      id: Date.now().toString(),
      status: 'Applied',
      history: [{ status: 'Applied', timestamp: new Date().toISOString() }],
    };
    saveApplications([...applications, newApp]);
  };

  const updateApplicationStatus = (id, status) => {
    const newApps = applications.map((app) => {
      if (app.id === id && app.status !== status) {
        const newHistory = [
          ...app.history,
          { status, timestamp: new Date().toISOString() },
        ];
        return { ...app, status, history: newHistory };
      }
      return app;
    });
    saveApplications(newApps);
  };

  const getApplicationById = useCallback(
    (id) => {
      return applications.find((app) => app.id === id);
    },
    [applications]
  );

  const value = {
    applications,
    loading,
    addApplication,
    getApplicationById,
    updateApplicationStatus,
  };

  return React.createElement(
    ApplicationsContext.Provider,
    { value: value },
    children
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (context === undefined) {
    throw new Error(
      'useApplications must be used within an ApplicationsProvider'
    );
  }
  return context;
}
