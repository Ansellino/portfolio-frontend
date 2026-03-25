export interface Skill {
  id: string;
  name: string;
  category: string;
  iconUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  thumbnailUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  startDate: string;
  endDate?: string;
  isFeatured: boolean;
  isPublished: boolean;
  skills: Skill[];
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  description?: string;
  responsibilities: string[];
  companyLogoUrl?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  employmentType: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  category: string;
  readingTimeMin: number;
  isPublished: boolean;
  publishedAt?: string;
  tags: Skill[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: Skill[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

export interface Profile {
  id: string;
  fullName: string;
  headline?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
