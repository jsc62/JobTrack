"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from 'react';

const LAGRINGSNOKKEL = 'applications';

const SoknadContext = createContext(undefined);

export function ApplicationsProvider({ children }) {
  const [soknader, setSoknader] = useState([]);
  const [laster, setLaster] = useState(true);

  // Hent søknader fra localStorage ved oppstart
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const lagret = window.localStorage.getItem(LAGRINGSNOKKEL);
        if (lagret) {
          setSoknader(JSON.parse(lagret));
        }
      } catch (error) {
        console.error('Klarte ikke lese søknader fra localStorage', error);
      }
      setLaster(false);
    }
  }, []);

  const lagreSoknader = (oppdatert) => {
    try {
      setSoknader(oppdatert);
      window.localStorage.setItem(LAGRINGSNOKKEL, JSON.stringify(oppdatert));
    } catch (error) {
      console.error('Klarte ikke lagre søknader til localStorage', error);
    }
  };

  const addApplication = (soknad) => {
    const nySoknad = {
      ...soknad,
      id: Date.now().toString(),
      status: 'Applied',
      history: [{ status: 'Applied', timestamp: new Date().toISOString() }],
    };
    lagreSoknader([...soknader, nySoknad]);
  };

  const updateApplicationStatus = (id, status) => {
    const oppdatert = soknader.map((soknad) => {
      if (soknad.id !== id || soknad.status === status) return soknad;
      return {
        ...soknad,
        status,
        history: [
          ...soknad.history,
          { status, timestamp: new Date().toISOString() },
        ],
      };
    });
    lagreSoknader(oppdatert);
  };

  const getApplicationById = useCallback(
    (id) => soknader.find((soknad) => soknad.id === id),
    [soknader]
  );

  const verdi = {
    applications: soknader,
    loading: laster,
    addApplication,
    getApplicationById,
    updateApplicationStatus,
  };

  return React.createElement(
    SoknadContext.Provider,
    { value: verdi },
    children
  );
}

export function useApplications() {
  const context = useContext(SoknadContext);
  if (context === undefined) {
    throw new Error('useApplications må brukes innenfor ApplicationsProvider');
  }
  return context;
}