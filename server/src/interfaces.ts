export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export enum Platform {
  DISNEY_PLUS = "DISNEY_PLUS",
  ESPN_PLUS = "ESPN_PLUS",
  HULU = "HULU",
  STAR_PLUS = "STAR_PLUS",
}

export enum Status {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export enum Severity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  platform: Platform;
  status: Status;
  severity: Severity;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}
