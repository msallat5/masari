// src/services/api.ts
import type { Application } from '../types/application';

// Using localStorage as our “API”
const STORAGE_KEY = 'masari_applications';

// ——————————————————————————————————————————————
// Mock‐data with full History/Events shape
// ——————————————————————————————————————————————
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const mockData: Application[] = [
      {
        id: '1',
        company: 'Google',
        position: 'Front-end Developer',
        dateApplied: '2023-05-10',
        location: 'Remote',
        source: 'LinkedIn',
        status: 'interview',
        notes: 'Had initial call with recruiter, technical interview scheduled.',
        createdAt: '2023-05-10T10:00:00Z',
        updatedAt: '2023-05-15T14:30:00Z',
        calendarEvents: [],
        statusHistory: [],
        notesHistory: [],
      },
      {
        id: '2',
        company: 'Microsoft',
        position: 'UI/UX Designer',
        dateApplied: '2023-04-22',
        location: 'Dubai, UAE',
        source: 'Company Website',
        status: 'applied',
        notes: 'Applied through career portal.',
        createdAt: '2023-04-22T09:15:00Z',
        updatedAt: '2023-04-22T09:15:00Z',
        calendarEvents: [],
        statusHistory: [],
        notesHistory: [],
      },
      {
        id: '3',
        company: 'Amazon',
        position: 'React Developer',
        dateApplied: '2023-06-01',
        location: 'Riyadh, KSA',
        source: 'Indeed',
        status: 'rejected',
        notes: 'Received rejection email after 2 weeks.',
        createdAt: '2023-06-01T11:30:00Z',
        updatedAt: '2023-06-15T16:45:00Z',
        calendarEvents: [],
        statusHistory: [],
        notesHistory: [],
      },
      {
        id: '4',
        company: 'Meta',
        position: 'Software Engineer',
        dateApplied: '2023-05-15',
        location: 'Remote',
        source: 'Referral',
        status: 'offer',
        notes: 'Received offer after final interview. Need to review compensation package.',
        createdAt: '2023-05-15T13:20:00Z',
        updatedAt: '2023-06-10T17:00:00Z',
        calendarEvents: [],
        statusHistory: [],
        notesHistory: [],
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
  }
};

initializeStorage();

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
