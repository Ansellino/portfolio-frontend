# Portfolio Frontend (Vue 3 + Vite)

Frontend portfolio berbasis Vue 3 + TypeScript dengan halaman public dan admin dashboard.

## Base API Contract

Frontend menggunakan base URL dari environment variable:

- `VITE_API_BASE_URL`
- Default local: `http://localhost:3000/api/v1`

Semua path endpoint di dokumen ini bersifat relatif terhadap `VITE_API_BASE_URL`.

## Menjalankan Local Development

1. Install dependency

```bash
npm install
```

2. Buat file environment

Copy `.env.example` menjadi `.env` lalu sesuaikan value.

3. Jalankan dev server

```bash
npm run dev
```

4. Build production

```bash
npm run build
```

## Environment Variables

Wajib:

- `VITE_API_BASE_URL`

Disarankan:

- `VITE_SITE_URL`
- `VITE_APP_TITLE`

Dev fallback/mock:

- `VITE_ADMIN_DUMMY_EMAIL`
- `VITE_ADMIN_DUMMY_PASSWORD`
- `VITE_ENABLE_DUMMY_SEED`

## Auth Behavior

- Akses token disisipkan otomatis sebagai Bearer token oleh axios interceptor.
- Saat `401`, frontend mencoba `POST /auth/refresh` lalu retry request.
- Jika backend tidak tersedia di mode development, frontend bisa fallback ke mock backend (tergantung konfigurasi env).

## Kontrak API yang Dipakai Frontend

### Auth

| Method | Endpoint | Dipakai untuk |
|---|---|---|
| POST | `/auth/login` | Login admin |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout |

### Public pages

| Method | Endpoint | Dipakai untuk |
|---|---|---|
| GET | `/profile` | Halaman About/public profile |
| GET | `/projects` | List project public |
| GET | `/projects/slug/:slug` | Detail project public |
| GET | `/blog` | List blog public |
| GET | `/blog/:slug` | Detail blog public |
| GET | `/experiences` | List experiences public |
| GET | `/education` | List education public |
| GET | `/skills` | List skills public |
| GET | `/certifications` | List certifications public |
| POST | `/contact` | Kirim pesan dari contact form |
| GET | `/resume/download` | Download resume |

### Admin dashboard/content

| Method | Endpoint | Dipakai untuk |
|---|---|---|
| GET | `/admin/profile` | Admin profile/resume preview |
| PATCH | `/admin/profile` | Update profile admin |
| GET | `/admin/projects` | List projects admin/statistik |
| GET | `/admin/projects/:id` | Detail project admin |
| POST | `/admin/projects` | Create project |
| PATCH | `/admin/projects/:id` | Update project/toggle publish |
| DELETE | `/admin/projects/:id` | Delete project |
| GET | `/admin/experiences` | List experiences admin/statistik |
| GET | `/admin/experiences/:id` | Detail experience admin |
| POST | `/admin/experiences` | Create experience |
| PATCH | `/admin/experiences/:id` | Update experience/toggle publish |
| DELETE | `/admin/experiences/:id` | Delete experience |
| GET | `/admin/education` | List education admin |
| GET | `/admin/education/:id` | Detail education admin |
| POST | `/admin/education` | Create education |
| PATCH | `/admin/education/:id` | Update education/toggle publish |
| DELETE | `/admin/education/:id` | Delete education |
| GET | `/admin/skills` | List skills admin |
| GET | `/admin/skills/:id` | Detail skill admin |
| POST | `/admin/skills` | Create skill |
| PATCH | `/admin/skills/:id` | Update skill/toggle publish |
| DELETE | `/admin/skills/:id` | Delete skill |
| GET | `/admin/certifications` | List certifications admin/statistik |
| GET | `/admin/certifications/:id` | Detail certification admin |
| POST | `/admin/certifications` | Create certification |
| PATCH | `/admin/certifications/:id` | Update certification/toggle publish |
| DELETE | `/admin/certifications/:id` | Delete certification |
| GET | `/admin/blog` | List blog admin/statistik |
| GET | `/admin/blog/:id` | Detail blog admin |
| POST | `/admin/blog` | Create blog |
| PATCH | `/admin/blog/:id` | Update blog/toggle publish |
| DELETE | `/admin/blog/:id` | Delete blog |
| GET | `/admin/messages` | Inbox contact message |
| PATCH | `/admin/messages/:id/read` | Mark message as read |
| DELETE | `/admin/messages/:id` | Delete message |
| GET | `/admin/resume/preview` | Resume preview backend |

## Mapping Endpoint ke Kode Frontend

Tabel ini dipakai sebagai checklist saat refactor endpoint supaya mudah melacak file yang terdampak.

| Endpoint | API client / caller utama | Halaman / consumer utama |
|---|---|---|
| `/auth/login` | [src/stores/auth.store.ts](src/stores/auth.store.ts) | [src/pages/admin/Login.vue](src/pages/admin/Login.vue) |
| `/auth/refresh` | [src/stores/auth.store.ts](src/stores/auth.store.ts) | Axios interceptor di [src/api/axios.ts](src/api/axios.ts) |
| `/auth/logout` | [src/stores/auth.store.ts](src/stores/auth.store.ts) | Header/logout flow admin |
| `/profile` | [src/api/profile.api.ts](src/api/profile.api.ts) | [src/pages/public/About.vue](src/pages/public/About.vue) |
| `/admin/profile` | Direct axios call | [src/pages/admin/Profile.vue](src/pages/admin/Profile.vue), [src/pages/admin/ResumePreview.vue](src/pages/admin/ResumePreview.vue) |
| `/projects` | [src/api/projects.api.ts](src/api/projects.api.ts) | [src/pages/public/Home.vue](src/pages/public/Home.vue), [src/pages/public/Projects.vue](src/pages/public/Projects.vue) |
| `/projects/slug/:slug` | [src/api/projects.api.ts](src/api/projects.api.ts) | [src/pages/public/ProjectDetail.vue](src/pages/public/ProjectDetail.vue) |
| `/admin/projects` | [src/api/projects.api.ts](src/api/projects.api.ts) | [src/pages/admin/projects/List.vue](src/pages/admin/projects/List.vue), [src/pages/admin/Dashboard.vue](src/pages/admin/Dashboard.vue), [src/pages/admin/ResumePreview.vue](src/pages/admin/ResumePreview.vue) |
| `/admin/projects/:id` | [src/api/projects.api.ts](src/api/projects.api.ts) | [src/pages/admin/projects/Edit.vue](src/pages/admin/projects/Edit.vue) |
| `/blog` | [src/api/blog.api.ts](src/api/blog.api.ts) | [src/pages/public/Blog.vue](src/pages/public/Blog.vue), [src/pages/public/Home.vue](src/pages/public/Home.vue) |
| `/blog/:slug` | [src/api/blog.api.ts](src/api/blog.api.ts) | [src/pages/public/BlogPost.vue](src/pages/public/BlogPost.vue) |
| `/admin/blog` | [src/api/blog.api.ts](src/api/blog.api.ts) | [src/pages/admin/blog/List.vue](src/pages/admin/blog/List.vue), [src/pages/admin/Dashboard.vue](src/pages/admin/Dashboard.vue) |
| `/admin/blog/:id` | [src/api/blog.api.ts](src/api/blog.api.ts) | [src/pages/admin/blog/Edit.vue](src/pages/admin/blog/Edit.vue) |
| `/experiences` | [src/api/experience.api.ts](src/api/experience.api.ts) | [src/pages/public/Experience.vue](src/pages/public/Experience.vue), [src/pages/public/Home.vue](src/pages/public/Home.vue) |
| `/admin/experiences` | [src/api/experience.api.ts](src/api/experience.api.ts) | [src/pages/admin/experiences/List.vue](src/pages/admin/experiences/List.vue), [src/pages/admin/Dashboard.vue](src/pages/admin/Dashboard.vue), [src/pages/admin/ResumePreview.vue](src/pages/admin/ResumePreview.vue) |
| `/admin/experiences/:id` | [src/api/experience.api.ts](src/api/experience.api.ts) | [src/pages/admin/experiences/Edit.vue](src/pages/admin/experiences/Edit.vue) |
| `/education` | [src/api/education.api.ts](src/api/education.api.ts) | [src/pages/public/About.vue](src/pages/public/About.vue) |
| `/admin/education` | [src/api/education.api.ts](src/api/education.api.ts) | [src/pages/admin/education/List.vue](src/pages/admin/education/List.vue), [src/pages/admin/ResumePreview.vue](src/pages/admin/ResumePreview.vue) |
| `/admin/education/:id` | [src/api/education.api.ts](src/api/education.api.ts) | [src/pages/admin/education/Edit.vue](src/pages/admin/education/Edit.vue) |
| `/skills` | [src/api/skills.api.ts](src/api/skills.api.ts) | [src/pages/public/About.vue](src/pages/public/About.vue) |
| `/admin/skills` | [src/api/skills.api.ts](src/api/skills.api.ts) | [src/pages/admin/skills/List.vue](src/pages/admin/skills/List.vue), [src/pages/admin/blog/Create.vue](src/pages/admin/blog/Create.vue), [src/pages/admin/projects/Create.vue](src/pages/admin/projects/Create.vue), [src/pages/admin/ResumePreview.vue](src/pages/admin/ResumePreview.vue) |
| `/admin/skills/:id` | [src/api/skills.api.ts](src/api/skills.api.ts) | [src/pages/admin/skills/Edit.vue](src/pages/admin/skills/Edit.vue) |
| `/certifications` | [src/api/certification.api.ts](src/api/certification.api.ts) | [src/pages/public/Certifications.vue](src/pages/public/Certifications.vue), [src/pages/public/Home.vue](src/pages/public/Home.vue) |
| `/admin/certifications` | [src/api/certification.api.ts](src/api/certification.api.ts) | [src/pages/admin/certifications/List.vue](src/pages/admin/certifications/List.vue), [src/pages/admin/Dashboard.vue](src/pages/admin/Dashboard.vue), [src/pages/admin/ResumePreview.vue](src/pages/admin/ResumePreview.vue) |
| `/admin/certifications/:id` | [src/api/certification.api.ts](src/api/certification.api.ts) | [src/pages/admin/certifications/Edit.vue](src/pages/admin/certifications/Edit.vue) |
| `/contact` | [src/api/contact.api.ts](src/api/contact.api.ts) | Contact section/public form |
| `/admin/messages` | Direct axios call | [src/pages/admin/Messages.vue](src/pages/admin/Messages.vue), [src/layouts/AdminLayout.vue](src/layouts/AdminLayout.vue), [src/pages/admin/Dashboard.vue](src/pages/admin/Dashboard.vue) |

### Dampak Cepat Saat Renovasi Endpoint

1. Ubah endpoint di file API client pada folder [src/api](src/api).
2. Cari direct axios call pada folder [src/pages](src/pages) dan [src/layouts](src/layouts).
3. Sinkronkan fallback development di [src/mocks/mockBackend.ts](src/mocks/mockBackend.ts).
4. Update tabel mapping ini agar tetap akurat untuk refactor berikutnya.

## Catatan Sinkronisasi Kontrak

- Jika endpoint backend berubah, update file API di `src/api` terlebih dahulu.
- Untuk perubahan route admin, update juga dashboard query dan mock backend agar behavior development tetap konsisten.
