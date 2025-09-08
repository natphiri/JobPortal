
export enum UserRole {
  Employee = 'employee',
  Employer = 'employer',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Job {
  id:string;
  title: string;
  company: string;
  location: string;
  description: string;
  employerId: string;
  views?: number;
  clicks?: number;
}

export interface CV {
  id:string;
  userId: string; // Link CV to a user
  name: string;
  title: string;
  experience: string[];
  skills: string[];
  avatarUrl?: string;
  cvFileName?: string; // Optional field for uploaded CV file name
  contactEmail?: string;
  phone?: string;
}

export interface Company {
  name: string;
  jobCount: number;
  jobTitles: string[];
  locations: string[];
}

export interface CompanyProfile {
  userId: string;
  companyName: string;
  logoUrl?: string; // Can be a data URL for local preview
  description?: string;
  culture?: string;
}

export enum ApplicationStatus {
  Applied = 'Applied',
  UnderReview = 'Under Review',
  Interviewing = 'Interviewing',
  Offered = 'Offer Received',
  Rejected = 'Rejected',
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  date: string; // ISO string
  status: ApplicationStatus;
  coverLetter?: string;
  attachments?: { name: string; type: string; }[];
}

export enum NotificationType {
  Success = 'success',
  Info = 'info',
  Alert = 'alert',
}

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  read: boolean;
}

export enum InterviewType {
  Virtual = 'Virtual',
  InPerson = 'In-Person',
}

export interface Interview {
  id: string;
  applicationId: string;
  jobId: string;
  userId: string;
  dateTime: string; // ISO string
  type: InterviewType;
  locationOrLink: string;
  notes?: string;
}

export interface JobAlert {
  id: string;
  type: 'keyword' | 'category';
  value: string; // The keyword or category name
}