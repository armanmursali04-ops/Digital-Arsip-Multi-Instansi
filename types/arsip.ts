export interface InstansiRecord {
  id: number
  nama: string
  slug: string
  slogan: string | null
  logo: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_image: string | null
  created_at: string
  updated_at: string
}

export interface RoleRecord {
  id: number
  name: string
  permissions: string[]
  created_at: string
}

export interface ProfileRecord {
  id: string
  name: string
  email: string
  role: string
  instansi_id?: number | null
  password?: string
  created_at: string
  updated_at: string
}

export interface KategoriRecord {
  id: number
  instansi_id?: number | null
  nama: string
  deskripsi: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface SubjekRecord {
  id: number
  instansi_id?: number | null
  nama: string
  deskripsi: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface ArsipRecord {
  id: number
  instansi_id?: number | null
  judul: string
  deskripsi: string | null
  file_path: string
  original_file_name: string | null
  file_size?: number
  kategori_id: number | null
  subjek_id: number | null
  user_id: string | null
  user_name?: string | null
  tanggal_arsip: string | null
  version: number
  download_count: number
  share_count: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface ArsipVersionRecord {
  id: number
  arsip_id: number
  version: number
  judul: string
  deskripsi: string | null
  file_path: string
  original_file_name: string | null
  user_id: string | null
  user_name?: string | null
  created_at: string
}

export interface SettingRecord {
  id: number
  name: string
  slogan: string | null
  logo: string | null
  hero_title?: string | null
  hero_subtitle?: string | null
  hero_image?: string | null
  created_at: string
  updated_at: string
}

export interface ActivityLogRecord {
  id: number
  instansi_id?: number | null
  log_name: string | null
  description: 'created' | 'updated' | 'deleted' | 'restored' | string
  subject_type: string | null
  subject_id: string | null
  causer_id: string | null
  causer_name: string | null
  properties: {
    attributes?: Record<string, any>
    old?: Record<string, any>
    [key: string]: any
  }
  created_at: string
}
