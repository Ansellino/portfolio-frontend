import type { InternalAxiosRequestConfig } from 'axios';
import { ref } from 'vue';

type AnyRecord = Record<string, any>;

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  thumbnailUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
  isFeatured: boolean;
  isPublished: boolean;
  skills: Array<{ id: string; name: string }>;
};

type Experience = {
  id: string;
  company: string;
  position: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  employmentType?: string;
  isPublished?: boolean;
};

type Certification = {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  category?: string;
  isPublished?: boolean;
};

type Education = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  isPublished?: boolean;
};

type Skill = {
  id: string;
  name: string;
  category?: string;
  iconUrl?: string;
  isPublished?: boolean;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  category?: string;
  readingTimeMin?: number;
  tags?: Array<{ id: string; name: string }>;
  isPublished?: boolean;
  publishedAt?: string;
  updatedAt?: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const ENABLE_DUMMY = import.meta.env.DEV && (import.meta.env.VITE_ENABLE_DUMMY_SEED ?? 'true') !== 'false';
export const isUsingMockData = ref(false);

export function markRealBackendConnected() {
  isUsingMockData.value = false;
}

const mockDb: {
  profile: AnyRecord;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  certifications: Certification[];
  education: Education[];
  blog: BlogPost[];
  messages: ContactMessage[];
} = {
  profile: {
    id: 'profile-1',
    fullName: 'Jeremy Ansellino Gunawan',
    headline: 'Software Engineer',
    bio: 'Building robust web products with practical UX and scalable architecture.',
    location: 'Indonesia',
    email: 'jeremy@example.com',
    phone: '+62 812-0000-0000',
    website: 'https://your-domain.com',
    githubUrl: 'https://github.com/your-username',
    linkedinUrl: 'https://linkedin.com/in/your-profile',
  },
  skills: [
    { id: 's1', name: 'Vue.js', category: 'Frontend', isPublished: true },
    { id: 's2', name: 'TypeScript', category: 'Frontend', isPublished: true },
    { id: 's3', name: 'Node.js', category: 'Backend', isPublished: true },
    { id: 's4', name: 'PostgreSQL', category: 'Database', isPublished: true },
    { id: 's5', name: 'Docker', category: 'DevOps', isPublished: true },
  ],
  projects: [
    {
      id: 'p1',
      title: 'Portfolio CMS',
      slug: 'portfolio-cms',
      description: 'Admin dashboard and public portfolio website.',
      content: 'Detailed write-up for project architecture and features.',
      thumbnailUrl: 'https://placehold.co/600x360?text=Portfolio+CMS',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/portfolio-cms',
      startDate: '2025-01-01',
      isFeatured: true,
      isPublished: true,
      skills: [
        { id: 's1', name: 'Vue.js' },
        { id: 's2', name: 'TypeScript' },
      ],
    },
    {
      id: 'p2',
      title: 'Internal Ops Dashboard',
      slug: 'internal-ops-dashboard',
      description: 'Monitoring and operations tool for internal teams.',
      content: 'Ops dashboard with realtime metrics and incident workflow.',
      thumbnailUrl: 'https://placehold.co/600x360?text=Ops+Dashboard',
      startDate: '2024-08-01',
      isFeatured: false,
      isPublished: true,
      skills: [
        { id: 's3', name: 'Node.js' },
        { id: 's4', name: 'PostgreSQL' },
      ],
    },
  ],
  experiences: [
    {
      id: 'e1',
      company: 'Tokocrypto',
      position: 'Analyst',
      description: 'Analyzed business and product opportunities.',
      startDate: '2025-04-01',
      endDate: '2025-06-30',
      location: 'Jakarta',
      employmentType: 'Contract',
      isPublished: true,
    },
    {
      id: 'e2',
      company: 'UMNGrove',
      position: 'Developer',
      description: 'Built web features for startup incubation programs.',
      startDate: '2024-10-01',
      endDate: '2025-03-31',
      location: 'Tangerang',
      employmentType: 'Part-time',
      isPublished: true,
    },
  ],
  certifications: [
    {
      id: 'c1',
      name: 'Google Cloud Fundamentals',
      issuer: 'Google Cloud',
      issueDate: '2025-02-01',
      category: 'Cloud',
      isPublished: true,
    },
    {
      id: 'c2',
      name: 'Frontend Web Expert',
      issuer: 'Dicoding',
      issueDate: '2024-12-01',
      category: 'Frontend',
      isPublished: true,
    },
  ],
  education: [
    {
      id: 'ed1',
      institution: 'BINUS University',
      degree: 'Bachelor',
      fieldOfStudy: 'Computer Science',
      startDate: '2021-09-01',
      endDate: '2025-07-01',
      description: 'Focused on software engineering and data systems.',
      isPublished: true,
    },
  ],
  blog: [
    {
      id: 'b1',
      title: 'Scaling Frontend Architecture',
      slug: 'scaling-frontend-architecture',
      excerpt: 'Practical patterns to keep large frontend apps maintainable.',
      content: '# Scaling Frontend Architecture\n\nUse domain boundaries and typed contracts.',
      coverImageUrl: 'https://placehold.co/920x460?text=Blog+Cover',
      category: 'Guide',
      readingTimeMin: 6,
      tags: [{ id: 's1', name: 'Vue.js' }],
      isPublished: true,
      publishedAt: '2025-02-10T09:00:00.000Z',
      updatedAt: '2025-02-10T09:00:00.000Z',
    },
  ],
  messages: [
    {
      id: 'm1',
      name: 'Hiring Team',
      email: 'hr@example.com',
      subject: 'Collaboration Opportunity',
      message: 'We are interested in discussing a frontend role with you.',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
  ],
};

function parseUrl(config: InternalAxiosRequestConfig) {
  const raw = config.url || '';
  return raw.split('?')[0];
}

function parseParams(config: InternalAxiosRequestConfig) {
  return (config.params ?? {}) as Record<string, any>;
}

function normalizeBoolean(value: any) {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return undefined;
}

function toPayload(data: any): AnyRecord {
  if (!data) return {};

  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    const payload: AnyRecord = {};
    for (const [key, value] of data.entries()) {
      if (payload[key] !== undefined) {
        const previous = payload[key];
        payload[key] = Array.isArray(previous) ? [...previous, value] : [previous, value];
      } else {
        payload[key] = value;
      }
    }
    return payload;
  }

  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }

  return data as AnyRecord;
}

function listResponse<T>(items: T[]) {
  return {
    data: items,
    total: items.length,
    page: 1,
    limit: items.length,
    totalPages: 1,
  };
}

function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find((item) => item.id === id) || null;
}

function upsertById<T extends { id: string }>(items: T[], id: string, patch: AnyRecord) {
  const idx = items.findIndex((item) => item.id === id);
  if (idx < 0) return null;
  items[idx] = { ...items[idx], ...patch };
  return items[idx];
}

function removeById<T extends { id: string }>(items: T[], id: string) {
  const idx = items.findIndex((item) => item.id === id);
  if (idx < 0) return false;
  items.splice(idx, 1);
  return true;
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

export function shouldUseMockFallback(error: any) {
  if (!ENABLE_DUMMY) return false;

  const status = error?.response?.status as number | undefined;
  if (!status) return true;

  // Use mock fallback for unready backend endpoints during development.
  return status === 404 || status >= 500;
}

export function getMockResponseData(config: InternalAxiosRequestConfig): any | undefined {
  if (!ENABLE_DUMMY || !config.url) return undefined;

  const method = String(config.method || 'get').toLowerCase();
  const path = parseUrl(config);
  const params = parseParams(config);
  const payload = toPayload(config.data);

  if (path === '/profile' || path === '/admin/profile') {
    if (method === 'get') {
      isUsingMockData.value = true;
      return { data: mockDb.profile };
    }
    if (method === 'patch') {
      mockDb.profile = { ...mockDb.profile, ...payload };
      isUsingMockData.value = true;
      return { data: mockDb.profile };
    }
  }

  if (path === '/skills' || path === '/admin/skills') {
    if (method === 'get') {
      const isPublished = normalizeBoolean(params.isPublished);
      const list = isPublished === undefined ? mockDb.skills : mockDb.skills.filter((item) => !!item.isPublished === isPublished);
      isUsingMockData.value = true;
      return listResponse(list);
    }
    if (method === 'post' && path === '/admin/skills') {
      const created = { id: newId('skill'), isPublished: true, ...payload } as Skill;
      mockDb.skills.unshift(created);
      isUsingMockData.value = true;
      return { data: created };
    }
  }

  const skillDetail = path.match(/^\/admin\/skills\/([^/]+)$/);
  if (skillDetail) {
    const id = skillDetail[1];
    if (method === 'get') {
      isUsingMockData.value = true;
      return { data: findById(mockDb.skills, id) };
    }
    if (method === 'patch') {
      const updated = upsertById(mockDb.skills, id, payload);
      isUsingMockData.value = true;
      return { data: updated };
    }
    if (method === 'delete') {
      isUsingMockData.value = true;
      return { success: removeById(mockDb.skills, id) };
    }
  }

  if (path === '/projects' || path === '/admin/projects') {
    if (method === 'get') {
      const isPublished = normalizeBoolean(params.isPublished);
      const isFeatured = normalizeBoolean(params.isFeatured);
      let list = [...mockDb.projects];
      if (isPublished !== undefined) list = list.filter((item) => item.isPublished === isPublished);
      if (isFeatured !== undefined) list = list.filter((item) => item.isFeatured === isFeatured);
      isUsingMockData.value = true;
      return listResponse(list);
    }

    if (method === 'post' && path === '/admin/projects') {
      const skillIds = Array.isArray(payload.skillIds) ? payload.skillIds : payload.skillIds ? [payload.skillIds] : [];
      const skills = mockDb.skills
        .filter((item) => skillIds.includes(item.id))
        .map((item) => ({ id: item.id, name: item.name }));
      const created: Project = {
        id: newId('project'),
        title: String(payload.title || 'Untitled Project'),
        slug: String(payload.slug || String(payload.title || 'untitled-project').toLowerCase().replace(/\s+/g, '-')),
        description: String(payload.description || ''),
        content: String(payload.content || ''),
        thumbnailUrl: String(payload.thumbnailUrl || ''),
        liveUrl: String(payload.liveUrl || ''),
        githubUrl: String(payload.githubUrl || ''),
        startDate: String(payload.startDate || ''),
        endDate: String(payload.endDate || ''),
        isFeatured: normalizeBoolean(payload.isFeatured) ?? false,
        isPublished: normalizeBoolean(payload.isPublished) ?? true,
        skills,
      };
      mockDb.projects.unshift(created);
      isUsingMockData.value = true;
      return { data: created };
    }
  }

  const projectBySlug = path.match(/^\/projects\/slug\/([^/]+)$/);
  if (projectBySlug && method === 'get') {
    const slug = projectBySlug[1];
    isUsingMockData.value = true;
    return { data: mockDb.projects.find((item) => item.slug === slug) || null };
  }

  const projectDetail = path.match(/^\/admin\/projects\/([^/]+)$/);
  if (projectDetail) {
    const id = projectDetail[1];
    if (method === 'get') {
      isUsingMockData.value = true;
      return { data: findById(mockDb.projects, id) };
    }
    if (method === 'patch') {
      const updated = upsertById(mockDb.projects, id, payload);
      isUsingMockData.value = true;
      return { data: updated };
    }
    if (method === 'delete') {
      isUsingMockData.value = true;
      return { success: removeById(mockDb.projects, id) };
    }
  }

  if (path === '/experiences' || path === '/admin/experiences') {
    if (method === 'get') {
      const isPublished = normalizeBoolean(params.isPublished);
      const list = isPublished === undefined
        ? mockDb.experiences
        : mockDb.experiences.filter((item) => !!item.isPublished === isPublished);
      isUsingMockData.value = true;
      return listResponse(list);
    }
    if (method === 'post' && path === '/admin/experiences') {
      const created = { id: newId('exp'), isPublished: true, ...payload } as Experience;
      mockDb.experiences.unshift(created);
      isUsingMockData.value = true;
      return { data: created };
    }
  }

  const expDetail = path.match(/^\/admin\/experiences\/([^/]+)$/);
  if (expDetail) {
    const id = expDetail[1];
    if (method === 'get') {
      isUsingMockData.value = true;
      return { data: findById(mockDb.experiences, id) };
    }
    if (method === 'patch') {
      isUsingMockData.value = true;
      return { data: upsertById(mockDb.experiences, id, payload) };
    }
    if (method === 'delete') {
      isUsingMockData.value = true;
      return { success: removeById(mockDb.experiences, id) };
    }
  }

  if (path === '/certifications' || path === '/admin/certifications') {
    if (method === 'get') {
      const isPublished = normalizeBoolean(params.isPublished);
      const list = isPublished === undefined
        ? mockDb.certifications
        : mockDb.certifications.filter((item) => !!item.isPublished === isPublished);
      isUsingMockData.value = true;
      return listResponse(list);
    }
    if (method === 'post' && path === '/admin/certifications') {
      const created = { id: newId('cert'), isPublished: true, ...payload } as Certification;
      mockDb.certifications.unshift(created);
      isUsingMockData.value = true;
      return { data: created };
    }
  }

  const certDetail = path.match(/^\/admin\/certifications\/([^/]+)$/);
  if (certDetail) {
    const id = certDetail[1];
    if (method === 'get') {
      isUsingMockData.value = true;
      return { data: findById(mockDb.certifications, id) };
    }
    if (method === 'patch') {
      isUsingMockData.value = true;
      return { data: upsertById(mockDb.certifications, id, payload) };
    }
    if (method === 'delete') {
      isUsingMockData.value = true;
      return { success: removeById(mockDb.certifications, id) };
    }
  }

  if (path === '/education' || path === '/admin/education') {
    if (method === 'get') {
      const isPublished = normalizeBoolean(params.isPublished);
      const list = isPublished === undefined
        ? mockDb.education
        : mockDb.education.filter((item) => !!item.isPublished === isPublished);
      isUsingMockData.value = true;
      return listResponse(list);
    }
    if (method === 'post' && path === '/admin/education') {
      const created = { id: newId('edu'), isPublished: true, ...payload } as Education;
      mockDb.education.unshift(created);
      isUsingMockData.value = true;
      return { data: created };
    }
  }

  const eduDetail = path.match(/^\/admin\/education\/([^/]+)$/);
  if (eduDetail) {
    const id = eduDetail[1];
    if (method === 'get') {
      isUsingMockData.value = true;
      return { data: findById(mockDb.education, id) };
    }
    if (method === 'patch') {
      isUsingMockData.value = true;
      return { data: upsertById(mockDb.education, id, payload) };
    }
    if (method === 'delete') {
      isUsingMockData.value = true;
      return { success: removeById(mockDb.education, id) };
    }
  }

  if (path === '/blog' || path === '/admin/blog' || path === '/admin/blog-posts') {
    if (method === 'get') {
      const isPublished = normalizeBoolean(params.isPublished);
      const list = isPublished === undefined
        ? mockDb.blog
        : mockDb.blog.filter((item) => !!item.isPublished === isPublished);
      isUsingMockData.value = true;
      return listResponse(list);
    }
    if (method === 'post' && path === '/admin/blog') {
      const created: BlogPost = {
        id: newId('blog'),
        title: String(payload.title || 'Untitled Post'),
        slug: String(payload.slug || String(payload.title || 'untitled-post').toLowerCase().replace(/\s+/g, '-')),
        excerpt: String(payload.excerpt || ''),
        content: String(payload.content || ''),
        coverImageUrl: String(payload.coverImageUrl || ''),
        category: String(payload.category || 'General'),
        readingTimeMin: Number(payload.readingTimeMin || 3),
        tags: [],
        isPublished: normalizeBoolean(payload.isPublished) ?? true,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDb.blog.unshift(created);
      isUsingMockData.value = true;
      return { data: created };
    }
  }

  const blogBySlug = path.match(/^\/blog\/([^/]+)$/);
  if (blogBySlug && method === 'get') {
    const slug = blogBySlug[1];
    isUsingMockData.value = true;
    return { data: mockDb.blog.find((item) => item.slug === slug) || null };
  }

  const blogDetail = path.match(/^\/admin\/blog\/([^/]+)$/);
  if (blogDetail) {
    const id = blogDetail[1];
    if (method === 'get') {
      isUsingMockData.value = true;
      return { data: findById(mockDb.blog, id) };
    }
    if (method === 'patch') {
      const updated = upsertById(mockDb.blog, id, { ...payload, updatedAt: new Date().toISOString() });
      isUsingMockData.value = true;
      return { data: updated };
    }
    if (method === 'delete') {
      isUsingMockData.value = true;
      return { success: removeById(mockDb.blog, id) };
    }
  }

  if (path === '/admin/messages' && method === 'get') {
    const isRead = normalizeBoolean(params.isRead);
    const list = isRead === undefined ? mockDb.messages : mockDb.messages.filter((item) => item.isRead === isRead);
    isUsingMockData.value = true;
    return {
      data: list,
      unreadCount: mockDb.messages.filter((item) => !item.isRead).length,
      total: list.length,
    };
  }

  if (path === '/contact' && method === 'post') {
    const created: ContactMessage = {
      id: newId('msg'),
      name: String(payload.name || 'Anonymous'),
      email: String(payload.email || 'anonymous@example.com'),
      subject: String(payload.subject || ''),
      message: String(payload.message || ''),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    mockDb.messages.unshift(created);
    isUsingMockData.value = true;
    return { data: created };
  }

  return undefined;
}
