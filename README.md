# Nuxt Digital Arsip Multi-Instansi (Nuxt 3 + Tailwind CSS + Supabase)

Versi **Multi-Instansi (Multi-Tenant)** dari aplikasi **Digital Arsip** (Nuxt 3 + Vue 3 + Tailwind CSS + Supabase). Dirancang agar beberapa sekolah atau instansi yang berbeda dapat menggunakan satu aplikasi yang sama dengan **isolasi data penuh** dan **Landing Page kustom per instansi (`/:slug`)**.

## Fitur Utama & Sistem 4 Role

1. **4 Role Terstruktur:**
   - **`superadmin` (Global Platform Admin):**
     - Login khusus melalui **`/superadmin-login`** (Akun default: `superadmin@digitalarsip.id` / `password`).
     - Mengelola daftar **Instansi / Sekolah** (`/dashboard/instansi`) beserta URL Landing Page uniknya (`/:slug`).
     - Mengelola akun **Admin Instansi** (`/dashboard/admin-instansi`) di setiap sekolah/instansi.
     - Memantau log aktivitas global (`/dashboard/audit-trails`).
   - **`admin` (Admin Instansi / Sekolah):**
     - Login melalui **`/:slug/login`** atau **`/login`**.
     - Hanya dapat mengakses dan melihat data milik instansinya sendiri.
     - Menambahkan dan mengelola pengguna **`writer`** dan **`viewer`** di instansinya (`/dashboard/users`) beserta cakupan kategori arsipnya (*data scope*).
     - Mengatur hak akses default role `writer` dan `viewer` di instansinya (`/dashboard/roles`).
     - Mengkustomisasi tampilan **Landing Page unik instansinya (`/:slug`)**, logo, slogan, dan Hero Banner melalui `/dashboard/settings`.
   - **`writer` (Operator / Pengelola Arsip Instansi):**
     - Mengelola arsip, konversi *Picture to PDF*, fungsi/kategori, subjek, dan *trash* di dalam instansinya sesuai izin kategori yang diberikan Admin Instansi.
   - **`viewer` (Pembaca Arsip Instansi):**
     - Melihat pratinjau dan mengunduh arsip/metadata di dalam instansinya sesuai kategori yang diizinkan (*read-only*).

2. **Autentikasi Aman Tanpa Registrasi Mandiri & Tanpa Google Login:**
   - Tidak ada form pendaftaran mandiri (*closed registration*).
   - Login khusus Superadmin di `/superadmin-login`.
   - Login pengguna instansi di `/login` atau `/:slug/login`.

3. **Landing Page Unik per Instansi (`/:slug`):**
   - Halaman utama `/` menampilkan **Direktori Portal Instansi** yang terdaftar.
   - Setiap instansi yang ditambahkan oleh Superadmin memiliki URL unik `/:slug` (contoh: `/sman-1-nusantara`) yang tampilannya dapat dikustomisasi oleh Admin instansi tersebut.

## Cara Menjalankan

```bash
cd nuxt-digital-arsip-multi
npm install
npm run dev
```

Untuk menyiapkan skema tabel Multi-Instansi di Supabase, jalankan isi file [`supabase/schema.sql`](./supabase/schema.sql) pada **SQL Editor** Supabase Anda.
