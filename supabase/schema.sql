-- ============================================================================
-- Digital Arsip Multi-Instansi - Supabase PostgreSQL Schema & Seeder
-- Mendukung Multi-Tenancy (Multi-Instansi / Sekolah) dengan 4 Role:
-- 1. superadmin (Global: Kelola Instansi & Admin Instansi)
-- 2. admin      (Admin Instansi: Kelola User Writer/Viewer, Arsip, & Landing Page Instansi)
-- 3. writer     (Operator Instansi: Kelola Arsip, Kategori, Subjek di Instansinya)
-- 4. viewer     (Pembaca Instansi: Hanya Lihat Data di Instansinya)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 0. Instansis (Daftar Instansi / Sekolah & Kustomisasi Landing Page)
CREATE TABLE IF NOT EXISTS public.instansis (
    id BIGSERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    slogan TEXT,
    logo TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. Roles (Menyimpan 4 role standar + metadata ACL/Credentials)
CREATE TABLE IF NOT EXISTS public.roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pastikan panjang kolom name pada roles memadai jika tabel sudah ada sebelumnya
ALTER TABLE public.roles ALTER COLUMN name TYPE VARCHAR(150);

-- 2. Profiles (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instansi_id BIGINT REFERENCES public.instansis(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'writer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instansi_id BIGINT REFERENCES public.instansis(id) ON DELETE CASCADE;

-- 3. Kategoris (Fungsi Arsip per Instansi)
CREATE TABLE IF NOT EXISTS public.kategoris (
    id BIGSERIAL PRIMARY KEY,
    instansi_id BIGINT REFERENCES public.instansis(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    color VARCHAR(20) NOT NULL DEFAULT '#F97316',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.kategoris ADD COLUMN IF NOT EXISTS instansi_id BIGINT REFERENCES public.instansis(id) ON DELETE CASCADE;

-- 4. Subjeks (Subjek Arsip per Instansi)
CREATE TABLE IF NOT EXISTS public.subjeks (
    id BIGSERIAL PRIMARY KEY,
    instansi_id BIGINT REFERENCES public.instansis(id) ON DELETE CASCADE,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    color VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.subjeks ADD COLUMN IF NOT EXISTS instansi_id BIGINT REFERENCES public.instansis(id) ON DELETE CASCADE;

-- 5. Arsips (Arsip Utama per Instansi + Soft Deletes + Versioning + Stats)
CREATE TABLE IF NOT EXISTS public.arsips (
    id BIGSERIAL PRIMARY KEY,
    instansi_id BIGINT REFERENCES public.instansis(id) ON DELETE CASCADE,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    file_path TEXT NOT NULL,
    original_file_name VARCHAR(255),
    kategori_id BIGINT REFERENCES public.kategoris(id) ON DELETE SET NULL,
    subjek_id BIGINT REFERENCES public.subjeks(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    tanggal_arsip DATE DEFAULT CURRENT_DATE,
    version INT NOT NULL DEFAULT 1,
    download_count INT NOT NULL DEFAULT 0,
    share_count INT NOT NULL DEFAULT 0,
    deleted_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.arsips ADD COLUMN IF NOT EXISTS instansi_id BIGINT REFERENCES public.instansis(id) ON DELETE CASCADE;

-- 6. Arsip Versions (Riwayat Versi Dokumen)
CREATE TABLE IF NOT EXISTS public.arsip_versions (
    id BIGSERIAL PRIMARY KEY,
    arsip_id BIGINT NOT NULL REFERENCES public.arsips(id) ON DELETE CASCADE,
    version INT NOT NULL,
    judul VARCHAR(255),
    deskripsi TEXT,
    file_path TEXT,
    original_file_name VARCHAR(255),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Pictures (Temporary / Photo Capture Records)
CREATE TABLE IF NOT EXISTS public.pictures (
    id BIGSERIAL PRIMARY KEY,
    arsip_id BIGINT REFERENCES public.arsips(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Settings (Profil Global Platform)
CREATE TABLE IF NOT EXISTS public.settings (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slogan TEXT,
    logo TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_title TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hero_image TEXT;

-- 9. Activity Logs (Audit Trail per Instansi & Global)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id BIGSERIAL PRIMARY KEY,
    instansi_id BIGINT REFERENCES public.instansis(id) ON DELETE CASCADE,
    log_name VARCHAR(100),
    description VARCHAR(100) NOT NULL,
    subject_type VARCHAR(100),
    subject_id VARCHAR(64),
    causer_id VARCHAR(64),
    causer_name VARCHAR(255),
    properties JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS instansi_id BIGINT REFERENCES public.instansis(id) ON DELETE CASCADE;

-- Indexes for multi-tenant performance
CREATE INDEX IF NOT EXISTS idx_instansis_slug ON public.instansis(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_instansi_id ON public.profiles(instansi_id);
CREATE INDEX IF NOT EXISTS idx_kategoris_instansi_id ON public.kategoris(instansi_id);
CREATE INDEX IF NOT EXISTS idx_subjeks_instansi_id ON public.subjeks(instansi_id);
CREATE INDEX IF NOT EXISTS idx_arsips_instansi_id ON public.arsips(instansi_id);
CREATE INDEX IF NOT EXISTS idx_arsips_kategori_id ON public.arsips(kategori_id);
CREATE INDEX IF NOT EXISTS idx_arsips_subjek_id ON public.arsips(subjek_id);
CREATE INDEX IF NOT EXISTS idx_arsips_deleted_at ON public.arsips(deleted_at);
CREATE INDEX IF NOT EXISTS idx_arsips_created_at ON public.arsips(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_arsip_versions_arsip_id ON public.arsip_versions(arsip_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_instansi_id ON public.activity_logs(instansi_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_subject ON public.activity_logs(subject_type, subject_id, created_at DESC);

-- Auto-update updated_at timestamp helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_instansis_updated_at ON public.instansis;
CREATE TRIGGER trg_instansis_updated_at
    BEFORE UPDATE ON public.instansis
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_kategoris_updated_at ON public.kategoris;
CREATE TRIGGER trg_kategoris_updated_at
    BEFORE UPDATE ON public.kategoris
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_subjeks_updated_at ON public.subjeks;
CREATE TRIGGER trg_subjeks_updated_at
    BEFORE UPDATE ON public.subjeks
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_arsips_updated_at ON public.arsips;
CREATE TRIGGER trg_arsips_updated_at
    BEFORE UPDATE ON public.arsips
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_settings_updated_at ON public.settings;
CREATE TRIGGER trg_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Disable any legacy OAuth auto-insert triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_user();

UPDATE auth.users SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()) WHERE email_confirmed_at IS NULL;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================
ALTER TABLE public.instansis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategoris ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arsips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arsip_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pictures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public and Authenticated read/write instansis" ON public.instansis;
CREATE POLICY "Public and Authenticated read/write instansis" ON public.instansis FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated read/write roles" ON public.roles;
CREATE POLICY "Authenticated read/write roles" ON public.roles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated read/write profiles" ON public.profiles;
CREATE POLICY "Authenticated read/write profiles" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated read/write kategoris" ON public.kategoris;
CREATE POLICY "Authenticated read/write kategoris" ON public.kategoris FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated read/write subjeks" ON public.subjeks;
CREATE POLICY "Authenticated read/write subjeks" ON public.subjeks FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated read/write arsips" ON public.arsips;
CREATE POLICY "Authenticated read/write arsips" ON public.arsips FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated read/write arsip_versions" ON public.arsip_versions;
CREATE POLICY "Authenticated read/write arsip_versions" ON public.arsip_versions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated read/write pictures" ON public.pictures;
CREATE POLICY "Authenticated read/write pictures" ON public.pictures FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read settings" ON public.settings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Authenticated write settings" ON public.settings;
CREATE POLICY "Authenticated write settings" ON public.settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated read/write activity_logs" ON public.activity_logs;
CREATE POLICY "Authenticated read/write activity_logs" ON public.activity_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- Supabase Storage Buckets & Policies
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('arsip', 'arsip', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('settings', 'settings', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Arsip & Settings" ON storage.objects;
CREATE POLICY "Public Read Arsip & Settings"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('arsip', 'settings'));

DROP POLICY IF EXISTS "Authenticated Upload Arsip & Settings" ON storage.objects;
CREATE POLICY "Authenticated Upload Arsip & Settings"
    ON storage.objects FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id IN ('arsip', 'settings'));

DROP POLICY IF EXISTS "Authenticated Update Arsip & Settings" ON storage.objects;
CREATE POLICY "Authenticated Update Arsip & Settings"
    ON storage.objects FOR UPDATE TO anon, authenticated
    USING (bucket_id IN ('arsip', 'settings'));

DROP POLICY IF EXISTS "Authenticated Delete Arsip & Settings" ON storage.objects;
CREATE POLICY "Authenticated Delete Arsip & Settings"
    ON storage.objects FOR DELETE TO anon, authenticated
    USING (bucket_id IN ('arsip', 'settings'));

-- ============================================================================
-- Seed Data (4 Roles: superadmin, admin, writer, viewer)
-- ============================================================================
DELETE FROM public.roles
WHERE name NOT IN ('superadmin', 'admin', 'writer', 'viewer')
  AND name NOT LIKE 'user_acl:%'
  AND name NOT LIKE 'user_cred:%'
  AND name NOT LIKE 'user_tenant:%'
  AND name NOT LIKE 'role_acl:%'
  AND name NOT LIKE 'instansi_meta:%'
  AND name NOT LIKE 'app_config:%';

INSERT INTO public.roles (name, permissions) VALUES
    ('superadmin', '["manage_instansi","manage_instansi_admin","view_audit_trail"]'::jsonb),
    ('admin', '["view_any_arsip","view_arsip","create_arsip","update_arsip","delete_arsip","restore_arsip","force_delete_arsip","view_any_kategori","create_kategori","update_kategori","delete_kategori","view_any_subjek","create_subjek","update_subjek","delete_subjek","view_any_user","create_user","update_user","delete_user","view_any_role","update_role","view_audit_trail","manage_settings"]'::jsonb),
    ('writer', '["view_any_arsip","view_arsip","create_arsip","update_arsip","delete_arsip","restore_arsip","force_delete_arsip","view_any_kategori","create_kategori","update_kategori","delete_kategori","view_any_subjek","create_subjek","update_subjek","delete_subjek"]'::jsonb),
    ('viewer', '["view_any_arsip","view_arsip","view_any_kategori","view_any_subjek"]'::jsonb)
ON CONFLICT (name) DO UPDATE SET permissions = EXCLUDED.permissions;

-- Seed Superadmin Account (Email: superadmin@digitalarsip.id | Password: password)
INSERT INTO public.profiles (name, email, role, instansi_id)
SELECT 'Super Administrator', 'superadmin@digitalarsip.id', 'superadmin', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE LOWER(email) = 'superadmin@digitalarsip.id');

-- Settings (Platform Header Default)
INSERT INTO public.settings (name, slogan, logo)
SELECT 'Portal Digital Arsip Multi-Instansi', 'Platform Pengelolaan Arsip Digital Terpadu untuk Sekolah & Instansi', NULL
WHERE NOT EXISTS (SELECT 1 FROM public.settings);
