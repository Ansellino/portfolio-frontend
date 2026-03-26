# Portfolio Frontend

Frontend untuk aplikasi portfolio berbasis Vue 3 + Vite + TypeScript, terdiri dari halaman public dan admin dashboard.

## Ringkasan

- Framework: Vue 3
- Build tool: Vite
- Language: TypeScript
- State: Pinia
- Data fetching: Vue Query
- HTTP client: Axios
- Routing: Vue Router
- Styling: Tailwind CSS

## Prasyarat

- Node.js 22 hingga <25
- npm 10+
- Backend API aktif

## Menjalankan Secara Lokal

1. Install dependency

```bash
npm install
```

2. Buat file `.env`

Contoh minimal:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_SITE_URL=http://localhost:5173
```

3. Jalankan development server

```bash
npm run dev
```

4. Build production

```bash
npm run build
```

5. Preview hasil build

```bash
npm run preview
```

## Environment Variables

Wajib:

- `VITE_API_BASE_URL` - Base URL backend API

Opsional:

- `VITE_SITE_URL` - Base URL frontend (SEO/sitemap)
- `VITE_APP_TITLE` - Judul aplikasi
- `VITE_ADMIN_DUMMY_EMAIL` - Dummy login email untuk development fallback
- `VITE_ADMIN_DUMMY_PASSWORD` - Dummy login password untuk development fallback
- `VITE_ENABLE_DUMMY_SEED` - Kontrol seed data mock (jika dipakai)

## Script Penting

- `npm run dev` - Jalankan local development
- `npm run build` - Type check + build
- `npm run preview` - Preview hasil build

Catatan: proses build otomatis menjalankan generate sitemap melalui script `prebuild`.

## Arsitektur Singkat

- `src/pages/public` - Halaman website publik
- `src/pages/admin` - Halaman dashboard admin
- `src/api` - Kontrak API client per resource
- `src/stores` - State management (auth, dsb.)
- `src/components` - UI reusable dan komponen domain
- `src/router` - Definisi route public/admin

## Alur Auth

- Access token disimpan di store dan disisipkan ke header Authorization.
- Jika response `401`, axios interceptor akan mencoba refresh token.
- Jika refresh gagal, session di-reset dan user diarahkan ke halaman login admin.

## Integrasi Backend

Frontend ini dirancang untuk backend dengan prefix API `/api/v1`.

Endpoint utama yang digunakan:

- Auth (`/auth/*`)
- Profile (`/profile`, `/admin/profile`)
- Projects (`/projects`, `/admin/projects`)
- Experiences (`/experiences`, `/admin/experiences`)
- Education (`/education`, `/admin/education`)
- Skills (`/skills`, `/admin/skills`)
- Certifications (`/certifications`, `/admin/certifications`)
- Blog (`/blog`, `/admin/blog`)
- Contact & Messages (`/contact`, `/admin/messages`)

## Deployment

- Konfigurasi SPA routing untuk Vercel tersedia di `vercel.json`.
- Pastikan environment variable `VITE_API_BASE_URL` di Vercel mengarah ke backend production.

## Troubleshooting Singkat

- Data tidak muncul: cek `VITE_API_BASE_URL` dan CORS backend.
- Selalu logout otomatis: cek endpoint refresh token dan secret JWT backend.
- Build gagal: pastikan versi Node sesuai engines di `package.json`.

## Mobile QA Checklist

Gunakan checklist ini setiap selesai perubahan UI agar responsivitas tetap aman.

Viewport minimum yang perlu diuji:

- `360x800` (Android kecil)
- `390x844` (iPhone 12/13/14)
- `768x1024` (tablet portrait)

Halaman yang wajib dicek:

- Home (`/`)
- Projects (`/projects`) dan detail (`/projects/:slug`)
- Blog (`/blog`) dan detail (`/blog/:slug`)
- Experience (`/experience`)
- Certifications (`/certifications`)
- About (`/about`)
- Contact (`/contact`)

Poin validasi cepat:

- Tidak ada horizontal scroll tidak sengaja.
- Heading/teks tidak terpotong dan tetap terbaca.
- Tombol/CTA utama mudah ditap (tidak terlalu kecil/rapat).
- Navbar mobile bisa buka/tutup dengan rapi (termasuk overlay).
- Card list tetap rapi saat konten judul/deskripsi panjang.
- Konten markdown (code block/table) tidak meluber; bisa scroll horizontal jika perlu.
- Pagination/filter/search tetap usable di layar kecil.

Langkah uji singkat:

1. Jalankan `npm run dev`.
2. Buka DevTools mode device toolbar.
3. Uji viewport di atas untuk semua halaman wajib.
4. Ulangi cek setelah merge perubahan layout besar.
