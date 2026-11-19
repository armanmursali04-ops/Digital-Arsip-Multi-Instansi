<template>
  <span
    v-if="showLabel"
    :class="[
      meta.pillClass,
      sizeClasses.pill,
      'inline-flex items-center rounded-md font-semibold ring-1 ring-inset whitespace-nowrap shrink-0'
    ]"
    :title="`Format file: ${ext}`"
  >
    <svg
      :class="[meta.iconColorClass, sizeClasses.svg, 'shrink-0']"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.9"
    >
      <!-- PDF: folded document with bottom label lines -->
      <template v-if="meta.category === 'pdf'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 9h3.75m-3.75 3h2.25M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </template>

      <!-- Image: photo frame with sun & mountain -->
      <template v-else-if="meta.category === 'image'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </template>

      <!-- Spreadsheet: table grid -->
      <template v-else-if="meta.category === 'spreadsheet'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25" />
      </template>

      <!-- Word Document: document text lines -->
      <template v-else-if="meta.category === 'word'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </template>

      <!-- Presentation: bar chart on board -->
      <template v-else-if="meta.category === 'presentation'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </template>

      <!-- Video: film reel / play -->
      <template v-else-if="meta.category === 'video'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
      </template>

      <!-- Audio: musical note -->
      <template v-else-if="meta.category === 'audio'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </template>

      <!-- Archive: compressed box -->
      <template v-else-if="meta.category === 'archive'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </template>

      <!-- Text / Code -->
      <template v-else-if="meta.category === 'text'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </template>

      <!-- Default File -->
      <template v-else>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </template>
    </svg>
    <span>{{ ext }}</span>
  </span>

  <!-- Standalone icon tile when showLabel is false -->
  <span
    v-else
    :class="[
      meta.tileClass,
      sizeClasses.tile,
      'inline-flex items-center justify-center rounded-lg ring-1 ring-inset shrink-0'
    ]"
    :title="`Format file: ${ext}`"
  >
    <svg
      :class="[meta.iconColorClass, sizeClasses.tileSvg]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="1.8"
    >
      <template v-if="meta.category === 'pdf'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 9h3.75m-3.75 3h2.25M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </template>
      <template v-else-if="meta.category === 'image'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </template>
      <template v-else-if="meta.category === 'spreadsheet'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25" />
      </template>
      <template v-else-if="meta.category === 'word'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </template>
      <template v-else-if="meta.category === 'presentation'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </template>
      <template v-else-if="meta.category === 'video'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
      </template>
      <template v-else-if="meta.category === 'audio'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </template>
      <template v-else-if="meta.category === 'archive'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </template>
      <template v-else-if="meta.category === 'text'">
        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </template>
      <template v-else>
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </template>
    </svg>
  </span>
</template>

<script setup lang="ts">
type FileCategory =
  | 'pdf'
  | 'image'
  | 'spreadsheet'
  | 'word'
  | 'presentation'
  | 'video'
  | 'audio'
  | 'archive'
  | 'text'
  | 'default'

const props = withDefaults(
  defineProps<{
    type?: string | null
    fileName?: string | null
    showLabel?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    type: null,
    fileName: null,
    showLabel: true,
    size: 'md'
  }
)

const ext = computed(() => {
  if (props.type && props.type.trim()) {
    return props.type.trim().replace(/^\./, '').toUpperCase()
  }
  const name = props.fileName || ''
  if (name.includes('.')) {
    return (name.split('.').pop() || 'FILE').toUpperCase()
  }
  return 'FILE'
})

const meta = computed<{
  category: FileCategory
  pillClass: string
  tileClass: string
  iconColorClass: string
}>(() => {
  const e = ext.value
  const neutralPill = 'bg-white text-slate-700 ring-slate-200/90 shadow-[0_1px_1px_rgba(15,23,42,0.03)]'
  const neutralTile = 'bg-slate-50 ring-slate-200/80'

  if (e === 'PDF') {
    return {
      category: 'pdf',
      pillClass: neutralPill,
      tileClass: neutralTile,
      iconColorClass: 'text-rose-600'
    }
  }
  if (['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'SVG', 'BMP', 'TIFF', 'HEIC'].includes(e)) {
    return {
      category: 'image',
      pillClass: neutralPill,
      tileClass: neutralTile,
      iconColorClass: 'text-sky-600'
    }
  }
  if (['XLS', 'XLSX', 'CSV', 'ODS'].includes(e)) {
    return {
      category: 'spreadsheet',
      pillClass: neutralPill,
      tileClass: neutralTile,
      iconColorClass: 'text-emerald-600'
    }
  }
  if (['DOC', 'DOCX', 'RTF', 'ODT'].includes(e)) {
    return {
      category: 'word',
      pillClass: neutralPill,
      tileClass: neutralTile,
      iconColorClass: 'text-blue-600'
    }
  }
  if (['PPT', 'PPTX', 'ODP'].includes(e)) {
    return {
      category: 'presentation',
      pillClass: neutralPill,
      tileClass: neutralTile,
      iconColorClass: 'text-amber-600'
    }
  }
  if (['MP4', 'MKV', 'MOV', 'AVI', 'WEBM'].includes(e)) {
    return {
      category: 'video',
      pillClass: neutralPill,
      tileClass: neutralTile,
      iconColorClass: 'text-indigo-600'
    }
  }
  if (['MP3', 'WAV', 'OGG', 'M4A', 'FLAC'].includes(e)) {
    return {
      category: 'audio',
      pillClass: neutralPill,
      tileClass: neutralTile,
      iconColorClass: 'text-fuchsia-600'
    }
  }
  if (['ZIP', 'RAR', '7Z', 'TAR', 'GZ'].includes(e)) {
    return {
      category: 'archive',
      pillClass: neutralPill,
      tileClass: neutralTile,
      iconColorClass: 'text-purple-600'
    }
  }
  if (['TXT', 'MD', 'JSON', 'XML', 'LOG'].includes(e)) {
    return {
      category: 'text',
      pillClass: neutralPill,
      tileClass: neutralTile,
      iconColorClass: 'text-slate-600'
    }
  }
  return {
    category: 'default',
    pillClass: neutralPill,
    tileClass: neutralTile,
    iconColorClass: 'text-slate-500'
  }
})

const sizeClasses = computed(() => {
  if (props.size === 'sm') {
    return {
      pill: 'gap-1.5 px-2 py-0.5 text-xs',
      svg: 'w-3.5 h-3.5',
      tile: 'h-7 w-7',
      tileSvg: 'w-4 h-4'
    }
  }
  if (props.size === 'lg') {
    return {
      pill: 'gap-2 px-3 py-1 text-xs',
      svg: 'w-4 h-4',
      tile: 'h-10 w-10',
      tileSvg: 'w-5 h-5'
    }
  }
  return {
    pill: 'gap-1.5 px-2.5 py-1 text-xs',
    svg: 'w-4 h-4',
    tile: 'h-9 w-9',
    tileSvg: 'w-5 h-5'
  }
})
</script>

