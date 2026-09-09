// ─────────────────────────────────────────────────────────────────────────────
//  Firestore Collection Names
// ─────────────────────────────────────────────────────────────────────────────

export const FS = {
  USERS: "users",
  INTERN_PROFILES: "intern_profiles",
  MENTOR_PROFILES: "mentor_profiles",
  STAFF_PROFILES: "staff_profiles",
  MEMBER_PROFILES: "member_profiles",
  MENTOR_ASSIGNMENTS: "mentor_assignments",
  NOTIFICATIONS: "notifications",
  AUDIT_LOGS: "audit_logs",
  COMPANY_PROJECTS: "company_projects",
} as const;

export type CollectionName = (typeof FS)[keyof typeof FS];

// ─────────────────────────────────────────────────────────────────────────────
//  Core Platform Types
// ─────────────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "mentor" | "intern" | "staff" | "member" | "user";
export type AccountStatus = "active" | "inactive" | "suspended" | "pending";
export type ProfileVisibility = "public" | "organization" | "private";

export interface PlatformUser {
  id: string;
  full_name: string;
  username?: string;
  email?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  age?: number | string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  region?: string | null;
  language?: string | null;
  bio?: string | null;
  skills?: string[];
  social_links?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  visibility: ProfileVisibility;
  role: UserRole;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Role-Specific Profile Types
// ─────────────────────────────────────────────────────────────────────────────

export interface InternProfile {
  user_id: string;
  university?: string | null;
  high_education?: string | null;
  current_education?: string | null;
  degree?: string | null;
  semester?: string | null;
  cgpa?: string | null;
  department?: string | null;
  position?: string | null;
  skills?: string[];
  joining_date?: string | null;
  end_date?: string | null;
  status?: "active" | "completed" | "terminated" | null;
  roll_number?: string | null;
  track_selected?: string | null;
  resume_url?: string | null;
  certificate_status?: "pending" | "approved" | "rejected" | null;
  certificate_id?: string | null;
  offer_letter_sent?: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface MentorProfile {
  user_id: string;
  department?: string | null;
  designation?: string | null;
  experience?: string | null;
  skills?: string[];
  bio?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StaffProfile {
  user_id: string;
  department?: string | null;
  position?: string | null;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Company Projects (Support & Marketing)
// ─────────────────────────────────────────────────────────────────────────────

export interface CompanyProject {
  id: string;
  user_id: string; // The staff who uploaded it
  file_name: string;
  file_url: string;
  file_size: number;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Mentor Assignment
// ─────────────────────────────────────────────────────────────────────────────

export type AssignmentStatus = "active" | "ended" | "removed";

export interface MentorAssignment {
  id: string;
  mentor_id: string;
  intern_id: string;
  assigned_by: string; // admin user ID
  status: AssignmentStatus;
  assigned_at: string;
  ended_at?: string | null;
  created_at: string;
  updated_at: string;
}


// ─────────────────────────────────────────────────────────────────────────────
//  Notifications
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationType =
  | "mentor_assigned"
  | "mentor_changed"
  | "mentor_removed"
  | "account_activated"
  | "account_suspended"
  | "post_liked"
  | "post_commented"
  | "role_changed"
  | "certificate_requested"
  | "certificate_approved"
  | "certificate_rejected";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  reference_id?: string | null;
  is_read: boolean;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Audit Logs
// ─────────────────────────────────────────────────────────────────────────────

export type AuditAction =
  | "CREATE_USER"
  | "DELETE_USER"
  | "CHANGE_ROLE"
  | "CHANGE_STATUS"
  | "ASSIGN_MENTOR"
  | "REASSIGN_MENTOR"
  | "REMOVE_MENTOR_ASSIGNMENT"
  | "ADMIN_EDIT_PROFILE"
  | "RESET_PASSWORD"
  | "CREATE_POST"
  | "DELETE_POST"
  | "GENERATE_CERTIFICATE"
  | "GENERATE_OFFER_LETTER";

export interface AuditLog {
  id: string;
  actor_id: string;
  action: AuditAction;
  target_user_id?: string | null;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Rich / Joined types (for UI)
// ─────────────────────────────────────────────────────────────────────────────

/** PlatformUser joined with InternProfile — used in admin intern management */
export interface RichIntern extends PlatformUser {
  intern_profile?: InternProfile;
  current_mentor?: { id: string; full_name: string; avatar_url?: string | null } | null;
}

/** PlatformUser joined with MentorProfile — used in admin mentor management */
export interface RichMentor extends PlatformUser {
  mentor_profile?: MentorProfile;
  intern_count?: number;
}
