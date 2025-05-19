// src/types/application.ts

// ——————————————————————————————————————————————
// All of your core application-tracking types live here.
// ——————————————————————————————————————————————

/** A step in your application’s lifecycle */
export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'assessment'
  | 'final_round'
  | 'offer'
  | 'negotiating'
  | 'accepted'
  | 'rejected'
  | 'declined';

/** How you’re applying (full-time, contract, etc.) */
export type JobType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'remote'
  | 'hybrid'
  | 'onsite';

/** An event already synced into your Calendar component */
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO 8601
  type: 'interview' | 'phone_screen' | 'assessment' | 'final_round';
  location?: string;
  notes?: string;
  applicationId: string;
}

// ——————————————————————————————————————————————
// NEW: structured details for any scheduled interview/screen/etc.
// ——————————————————————————————————————————————
export interface InterviewDetails {
  /** ISO 8601 date-time when the interview/screen/etc. is set */
  dateTime: string;
  /** Optional venue or call-in info */
  location?: string;
  /** Any free-form notes about the meeting */
  notes?: string;
}

// ——————————————————————————————————————————————
// NEW: one history entry per status change
// ——————————————————————————————————————————————
export interface StatusHistoryItem {
  /** Which status was set */
  status: ApplicationStatus;
  /** ISO 8601 timestamp of when it changed */
  date: string;
  /** Only present for interview/phone_screen/etc. statuses */
  interviewDetails?: InterviewDetails;
}

// ——————————————————————————————————————————————
// NEW: one history entry per free-form note
// ——————————————————————————————————————————————
export interface NoteHistoryItem {
  /** The note’s text */
  note: string;
  /** ISO 8601 timestamp */
  date: string;
}

// ——————————————————————————————————————————————
// Your main Application record, with full history baked in
// ——————————————————————————————————————————————
export interface Application {
  id: string;
  company: string;
  position: string;
  dateApplied: string;       // ISO 8601
  location: string;
  source: string;
  status: ApplicationStatus;
  jobType?: JobType;
  jobUrl?: string;
  notes?: string;            // legacy free-form blob
  createdAt: string;         // ISO 8601
  updatedAt: string;         // ISO 8601

  /** Calendar events already synced */
  calendarEvents?: CalendarEvent[];

  /** Full log of every status change, in chronological order */
  statusHistory?: StatusHistoryItem[];

  /** Full log of every free-form note you’ve added */
  notesHistory?: NoteHistoryItem[];
}

/** For filtering/searching your applications list */
export interface ApplicationFilters {
  status?: ApplicationStatus;
  dateRange?: [string, string]; // [ISO start, ISO end]
  source?: string;
  search?: string;
}