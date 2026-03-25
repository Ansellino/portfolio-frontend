import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        { path: '', component: () => import('@/pages/public/Home.vue'), meta: { breadcrumb: 'Home' } },
        {
          path: 'projects',
          component: () => import('@/pages/public/Projects.vue'),
          meta: { breadcrumb: 'Projects' },
        },
        {
          path: 'projects/:slug',
          component: () => import('@/pages/public/ProjectDetail.vue'),
          meta: { breadcrumb: 'Project Detail' },
        },
        {
          path: 'experience',
          component: () => import('@/pages/public/Experience.vue'),
          meta: { breadcrumb: 'Experience' },
        },
        {
          path: 'certifications',
          component: () => import('@/pages/public/Certifications.vue'),
          meta: { breadcrumb: 'Certifications' },
        },
        { path: 'blog', component: () => import('@/pages/public/Blog.vue'), meta: { breadcrumb: 'Blog' } },
        {
          path: 'blog/:slug',
          component: () => import('@/pages/public/BlogPost.vue'),
          meta: { breadcrumb: 'Blog Post' },
        },
        { path: 'about', component: () => import('@/pages/public/About.vue'), meta: { breadcrumb: 'About' } },
        { path: 'contact', component: () => import('@/pages/public/Contact.vue'), meta: { breadcrumb: 'Contact' } },
      ],
    },

    {
      path: '/admin/login',
      component: () => import('@/pages/admin/Login.vue'),
      meta: { breadcrumb: 'Login' },
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('@/pages/admin/Dashboard.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Dashboard' },
        },
        {
          path: 'projects',
          component: () => import('@/pages/admin/projects/List.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Projects' },
        },
        {
          path: 'projects/create',
          component: () => import('@/pages/admin/projects/Create.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Create Project' },
        },
        {
          path: 'projects/edit/:id',
          component: () => import('@/pages/admin/projects/Edit.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Edit Project' },
        },
        {
          path: 'experiences',
          component: () => import('@/pages/admin/experiences/List.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Experiences' },
        },
        {
          path: 'experiences/create',
          component: () => import('@/pages/admin/experiences/Create.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Create Experience' },
        },
        {
          path: 'experiences/edit/:id',
          component: () => import('@/pages/admin/experiences/Edit.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Edit Experience' },
        },
        {
          path: 'certifications',
          component: () => import('@/pages/admin/certifications/List.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Certifications' },
        },
        {
          path: 'certifications/create',
          component: () => import('@/pages/admin/certifications/Create.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Create Certification' },
        },
        {
          path: 'certifications/edit/:id',
          component: () => import('@/pages/admin/certifications/Edit.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Edit Certification' },
        },
        {
          path: 'education',
          component: () => import('@/pages/admin/education/List.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Education' },
        },
        {
          path: 'education/create',
          component: () => import('@/pages/admin/education/Create.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Create Education' },
        },
        {
          path: 'education/edit/:id',
          component: () => import('@/pages/admin/education/Edit.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Edit Education' },
        },
        {
          path: 'skills',
          component: () => import('@/pages/admin/skills/List.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Skills' },
        },
        {
          path: 'skills/create',
          component: () => import('@/pages/admin/skills/Create.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Create Skill' },
        },
        {
          path: 'skills/edit/:id',
          component: () => import('@/pages/admin/skills/Edit.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Edit Skill' },
        },
        {
          path: 'blog',
          component: () => import('@/pages/admin/blog/List.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Blog' },
        },
        {
          path: 'blog/create',
          component: () => import('@/pages/admin/blog/Create.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Write Post' },
        },
        {
          path: 'blog/edit/:id',
          component: () => import('@/pages/admin/blog/Edit.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Edit Post' },
        },
        {
          path: 'messages',
          component: () => import('@/pages/admin/Messages.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Messages' },
        },
        {
          path: 'profile',
          component: () => import('@/pages/admin/Profile.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Profile' },
        },
        {
          path: 'resume/preview',
          component: () => import('@/pages/admin/ResumePreview.vue'),
          meta: { requiresAuth: true, breadcrumb: 'Resume Preview' },
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/admin/login';
});

export default router;
