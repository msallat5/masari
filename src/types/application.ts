// ——————————————————————————————————————————————
// Core application-tracking types
// ——————————————————————————————————————————————

/**
 * A step in an application’s lifecycle.
 */
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

/**
 * The form of employment you’re applying for.
 */
export type JobType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'remote'
  | 'hybrid'
  | 'onsite';

// ——————————————————————————————————————————————
// Calendar & scheduling
// ——————————————————————————————————————————————

/**
 * An event synced into the calendar (e.g. interview, phone screen).
 */
export interface CalendarEvent {
  /** Unique event identifier */
  id: string;
  /** Title to display in the calendar */
  title: string;
  /** ISO 8601 date or datetime of the event */
  date: string;
  /** Type of event */
  type: 'interview' | 'phone_screen' | 'assessment' | 'final_round';
  /** Optional location or call-in info */
  location?: string;
  /** Optional free-form notes */
  notes?: string;
  /** ID of the application this event belongs to */
  applicationId: string;
}

/**
 * Structured details for scheduling an interview or screen.
 */
export interface InterviewDetails {
  /** ISO 8601 date-time when the meeting is set */
  dateTime: string;
  /** Optional venue or dial-in information */
  location?: string;
  /** Any additional notes about the meeting */
  notes?: string;
}

// ——————————————————————————————————————————————
// History log entries
// ——————————————————————————————————————————————

/**
 * One record for each status change in an application.
 */
export interface StatusHistoryItem {
  /** The new status that was set */
  status: ApplicationStatus;
  /** When the status change occurred (ISO 8601) */
  date: string;
  /** Only for statuses that involve a meeting (interview, phone screen, etc.) */
  interviewDetails?: InterviewDetails;
}

/**
 * One record for each free-form note added to an application.
 */
export interface NoteHistoryItem {
  /** The note text */
  note: string;
  /** When the note was added (ISO 8601) */
  date: string;
}

// ——————————————————————————————————————————————
// Main application record
// ——————————————————————————————————————————————

/**
 * A job application, including status and note history.
 */
export interface Application {
  /** Unique application identifier */
  id: string;
  /** Company name */
  company: string;
  /** Job title or position */
  position: string;
  /** Date applied (ISO 8601) */
  dateApplied: string;
  /** Location of the role (city, remote, etc.) */
  location: string;
  /** How you found the job (e.g., referral, LinkedIn) */
  source: string;
  /** Current status in the application process */
  status: ApplicationStatus;
  /** Optional employment type */
  jobType?: JobType;
  /** Optional link to the job posting */
  jobUrl?: string;
  /** Legacy free-form notes blob */
  notes?: string;
  /** When this record was created (ISO 8601) */
  createdAt: string;
  /** When this record was last updated (ISO 8601) */
  updatedAt: string;

  /** Any calendar events already synced for this application */
  calendarEvents?: CalendarEvent[];

  /** Chronological log of every status change */
  statusHistory?: StatusHistoryItem[];

  /** Chronological log of every note added */
  notesHistory?: NoteHistoryItem[];
}

// ——————————————————————————————————————————————
// Filtering & search
// ——————————————————————————————————————————————

/**
 * Criteria for filtering the applications list.
 */
export interface ApplicationFilters {
  /** Filter by application status */
  status?: ApplicationStatus;
  /** Filter by applied-date range [start, end] (ISO 8601) */
  dateRange?: [string, string];
  /** Filter by source string */
  source?: string;
  /** Generic text search over company/position/etc. */
  search?: string;
}
