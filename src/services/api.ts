import type { Application } from '../types/application';

// ─────────────────────────────────────────────────────────────────────────────
// Constants & Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Key under which applications are stored in localStorage */
const STORAGE_KEY = 'masari_applications';

/**
 * Generate a short pseudo‐random ID for new applications.
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// ─────────────────────────────────────────────────────────────────────────────
// applicationService
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A simple "API" using localStorage for CRUD operations on Application records.
 */
export const applicationService = {
  /**
   * Fetch all stored applications.
   * @returns An array of Application objects (empty if none exist).
   */
  async getAll(): Promise<Application[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Application[] : [];
  },

  /**
   * Retrieve a single application by its ID.
   * @param id — The application ID to look up.
   * @returns The matching Application or null if not found.
   */
  async getById(id: string): Promise<Application | null> {
    const list = await this.getAll();
    return list.find(app => app.id === id) ?? null;
  },

  /**
   * Create and persist a new application.
   * @param payload — All required Application fields except id/createdAt/updatedAt.
   * @returns The newly created Application.
   */
  async create(
    payload: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Application> {
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

    const list = await this.getAll();
    list.push(newApp);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    return newApp;
  },

  /**
   * Update one or more fields of an existing application.
   * @param id — The ID of the application to update.
   * @param patch — Partial fields to merge into the existing record.
   * @returns The updated Application, or null if no matching ID was found.
   */
  async update(
    id: string,
    patch: Partial<Application>
  ): Promise<Application | null> {
    const list = await this.getAll();
    const index = list.findIndex(app => app.id === id);
    if (index === -1) return null;

    const updatedApp: Application = {
      ...list[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updatedApp;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return updatedApp;
  },

  /**
   * Delete an application by ID.
   * @param id — The ID of the application to remove.
   * @returns True if deletion succeeded (ID found), false otherwise.
   */
  async delete(id: string): Promise<boolean> {
    const list = await this.getAll();
    const filtered = list.filter(app => app.id !== id);
    if (filtered.length === list.length) {
      // No record had the matching ID
      return false;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};
