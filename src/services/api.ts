// src/services/api.ts
import type { Application } from '../types/application';

// Using localStorage as our “API”
const STORAGE_KEY = 'masari_applications';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const applicationService = {
  /** Fetch entire list */
  getAll: async (): Promise<Application[]> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return Promise.resolve(data ? JSON.parse(data) : []);
  },

  /** Single record by ID */
  getById: async (id: string): Promise<Application | null> => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const apps: Application[] = JSON.parse(data);
    return Promise.resolve(apps.find(a => a.id === id) || null);
  },

  /** Create a brand-new application */
  create: async (
    payload: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Application> => {
    const now = new Date().toISOString();
    const newApp: Application = {
      ...payload,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      calendarEvents: [],
      statusHistory: [],
      notesHistory: [],
    };

    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Application[];
    list.push(newApp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    return Promise.resolve(newApp);
  },

  /** Update any subset of fields */
  update: async (
    id: string,
    patch: Partial<Application>
  ): Promise<Application | null> => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const list: Application[] = JSON.parse(data);
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return null;

    const updated: Application = {
      ...list[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return Promise.resolve(updated);
  },

  /** Remove one by ID */
  delete: async (id: string): Promise<boolean> => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return Promise.resolve(false);

    const list: Application[] = JSON.parse(data);
    const filtered = list.filter(a => a.id !== id);
    if (filtered.length === list.length) return Promise.resolve(false);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return Promise.resolve(true);
  },
};
