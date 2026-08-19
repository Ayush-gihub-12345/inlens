export type ServiceCategory =
  | "identity"
  | "certificates"
  | "licences"
  | "schemes"
  | "exams-jobs"
  | "agri"
  | "voter"
  | "vehicle";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ChangeLogEntry {
  date: string; // ISO date
  summary: string;
}

export interface StateVariant {
  /** lowercase state code used in the URL, e.g. "mh", "dl", "up", "ka" */
  stateCode: string;
  stateName: string;
  portalName: string;
  applyUrl: string;
  fee: string;
  processingTime: string;
  validity: string;
  notes?: string;
}

export interface Service {
  slug: string;
  name: string;
  category: ServiceCategory;
  department: string;
  /** ISO 3166-2 state code, or "all" for central/all-India services */
  state: string;
  summary: string;
  eligibility: string[];
  documents: string[];
  fee: string;
  process: string[];
  officialUrl: string;
  applyUrl?: string;
  trackUrl?: string;
  lastVerified: string; // ISO date
  source: string;
  faq: FaqItem[];
  relatedServices: string[]; // slugs
  tags: string[];
  changeLog?: ChangeLogEntry[];
  stateVariants?: StateVariant[];
}
