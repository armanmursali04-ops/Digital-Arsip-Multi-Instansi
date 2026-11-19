<template>
  <div class="max-w-4xl space-y-5">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900">Petunjuk Penggunaan</h1>
      <p class="text-sm text-slate-500 mt-0.5">Panduan langkah demi langkah pengelolaan dokumen pada sistem Digital Arsip.</p>
    </div>

    <div class="space-y-3">
      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 tabular-nums">01</span>
            <span>Tata Cara Pembuatan Arsip</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <ol class="list-decimal list-inside space-y-2">
            <li>Buka menu <strong>Arsip</strong> di sidebar kiri.</li>
            <li>Klik tombol <strong>Buat Arsip</strong> di pojok kanan atas.</li>
            <li>
              Isi formulir yang tersedia:
              <ul class="list-disc list-inside ml-5 mt-2 space-y-1 text-slate-600">
                <li><strong>Judul Arsip:</strong> Nama atau judul untuk arsip Anda.</li>
                <li><strong>Deskripsi:</strong> Penjelasan singkat mengenai isi arsip.</li>
                <li><strong>Fungsi:</strong> Pilih fungsi arsip (misal: Keuangan, Personalia).</li>
                <li><strong>Subjek:</strong> (Opsional) Pilih subjek yang lebih spesifik.</li>
                <li><strong>File Arsip:</strong> Unggah file yang ingin diarsipkan.</li>
                <li><strong>Tanggal Arsip:</strong> Tanggal pembuatan atau relevansi arsip.</li>
              </ul>
            </li>
            <li>Setelah semua terisi, klik tombol <strong>Buat</strong> untuk menyimpan.</li>
          </ol>
        </div>
      </details>

      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 tabular-nums">02</span>
            <span>Tata Cara Penghapusan Arsip</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <p class="mb-2">Penghapusan ini bersifat sementara (Soft Delete). Arsip akan dipindahkan ke <strong>Trash Arsip</strong> dan dapat dipulihkan.</p>
          <ol class="list-decimal list-inside space-y-2">
            <li>Buka menu <strong>Arsip</strong>.</li>
            <li>Cari arsip yang ingin dihapus pada tabel.</li>
            <li>Klik tombol <strong>Hapus</strong> di sebelah kanan baris arsip.</li>
            <li>Konfirmasi penghapusan pada dialog yang muncul.</li>
          </ol>
        </div>
      </details>

      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 tabular-nums">03</span>
            <span>Tata Cara Restore Arsip</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <ol class="list-decimal list-inside space-y-2">
            <li>Buka menu <strong>Trash Arsip</strong> di bawah grup <strong>Manajemen Arsip</strong>.</li>
            <li>Cari arsip yang ingin dipulihkan.</li>
            <li>Klik tombol <strong>Restore</strong> pada baris arsip tersebut.</li>
            <li>Konfirmasi pemulihan, dan arsip akan kembali ke daftar <strong>Arsip</strong> utama.</li>
          </ol>
        </div>
      </details>

      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-rose-50 text-xs font-bold text-rose-700 tabular-nums">04</span>
            <span>Tata Cara Hapus Permanen Arsip</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <p class="text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-3 text-xs font-semibold">
            PERINGATAN: Tindakan ini tidak dapat diurungkan. File fisik juga akan terhapus dari storage.
          </p>
          <ol class="list-decimal list-inside space-y-2">
            <li>Buka menu <strong>Trash Arsip</strong>.</li>
            <li>Cari arsip yang ingin dihapus permanen.</li>
            <li>Klik tombol <strong>Permanent Delete</strong> pada baris arsip tersebut.</li>
            <li>Konfirmasi penghapusan permanen pada dialog yang muncul.</li>
          </ol>
        </div>
      </details>

      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 tabular-nums">05</span>
            <span>Tata Cara Picture to PDF</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <p class="mb-2">Fitur ini memungkinkan Anda mengambil beberapa gambar dari kamera dan menyimpannya sebagai satu file PDF.</p>
          <ol class="list-decimal list-inside space-y-2">
            <li>Buka menu <strong>Picture to PDF</strong> di sidebar kiri.</li>
            <li>Isi <strong>Judul Arsip</strong> dan <strong>Deskripsi</strong>.</li>
            <li>Klik <strong>+ Ambil Gambar (Kamera)</strong> untuk membuka kamera atau pilih gambar.</li>
            <li>Gambar yang diambil akan muncul sebagai thumbnail. Anda bisa mengatur urutan atau menghapusnya.</li>
            <li>Setelah selesai, klik <strong>Simpan ke Arsip (Buat PDF)</strong>. Sistem akan mengonversi gambar menjadi PDF dan menyimpannya di menu <strong>Arsip</strong>.</li>
          </ol>
        </div>
      </details>

      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 tabular-nums">06</span>
            <span>Cara Pembuatan Fungsi Arsip (Kategori)</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <ol class="list-decimal list-inside space-y-2">
            <li>Buka menu <strong>Fungsi Arsip</strong> di bawah grup <strong>Manajemen Arsip</strong>.</li>
            <li>Klik <strong>+ Buat Fungsi</strong>.</li>
            <li>Isi nama fungsi (misal: &quot;Pemasaran&quot;).</li>
            <li>Pilih warna untuk label agar mudah dikenali.</li>
            <li>Klik <strong>Simpan</strong> untuk menyimpan.</li>
          </ol>
        </div>
      </details>

      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 tabular-nums">07</span>
            <span>Cara Pembuatan Subjek Arsip</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <ol class="list-decimal list-inside space-y-2">
            <li>Buka menu <strong>Subjek Arsip</strong> di bawah grup <strong>Manajemen Arsip</strong>.</li>
            <li>Klik <strong>+ Buat Subjek</strong>.</li>
            <li>Isi nama subjek (misal: &quot;Laporan Bulanan&quot;).</li>
            <li>Pilih warna untuk label.</li>
            <li>Klik <strong>Simpan</strong> untuk menyimpan.</li>
          </ol>
        </div>
      </details>

      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 tabular-nums">08</span>
            <span>Cara Pembuatan Roles</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <ol class="list-decimal list-inside space-y-2">
            <li>Buka menu <strong>Roles</strong> di bawah grup <strong>Pengaturan Sistem</strong>.</li>
            <li>Klik <strong>+ Buat Role</strong>.</li>
            <li>Masukkan nama role (misal: &quot;Operator&quot;, &quot;Viewer&quot;).</li>
            <li>Pilih izin (permissions) yang akan diberikan untuk role tersebut.</li>
            <li>Klik <strong>Simpan</strong> untuk menyimpan.</li>
          </ol>
        </div>
      </details>

      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 tabular-nums">09</span>
            <span>Cara Pembuatan User Baru</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <ol class="list-decimal list-inside space-y-2">
            <li>Buka menu <strong>Users</strong> di bawah grup <strong>Pengaturan Sistem</strong>.</li>
            <li>Klik <strong>+ Buat User</strong>.</li>
            <li>Isi detail user seperti Nama, Email, dan Role.</li>
            <li>Klik <strong>Simpan</strong> untuk menyimpan.</li>
          </ol>
        </div>
      </details>

      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 tabular-nums">10</span>
            <span>Cara Pengelolaan Setting Instansi</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <ol class="list-decimal list-inside space-y-2">
            <li>Buka menu <strong>Settings</strong> di bawah grup <strong>Pengaturan Sistem</strong>.</li>
            <li>Ubah informasi umum aplikasi seperti Nama Perusahaan, Slogan Perusahaan, dan Logo Perusahaan.</li>
            <li>Klik <strong>Simpan Pengaturan</strong> untuk menyimpan perubahan.</li>
          </ol>
        </div>
      </details>

      <details class="group bg-white shadow-sm border border-slate-200/90 rounded-lg overflow-hidden">
        <summary class="px-5 py-4 cursor-pointer font-semibold text-slate-900 flex justify-between items-center gap-4 hover:bg-slate-50/70 transition-colors">
          <span class="flex items-center gap-3">
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700 tabular-nums">11</span>
            <span>Cara Update Password</span>
          </span>
          <svg class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div class="px-5 py-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed bg-slate-50/40">
          <ol class="list-decimal list-inside space-y-2">
            <li>Klik profil Anda di pojok kanan atas layar atau di bagian bawah sidebar.</li>
            <li>Pilih menu <strong>Profil Saya</strong>.</li>
            <li>Scroll ke bagian <strong>Update Password</strong>.</li>
            <li>Masukkan password baru dan konfirmasinya.</li>
            <li>Klik <strong>Simpan Perubahan</strong> untuk mengubah password.</li>
          </ol>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})
</script>
