<template>
  <div class="relative h-72 w-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  labels: string[]
  values: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Jumlah Arsip',
      data: props.values,
      backgroundColor: '#1d4ed8',
      borderColor: '#1d4ed8',
      borderWidth: 0,
      borderRadius: 4,
      borderSkipped: false,
      hoverBackgroundColor: '#1e40af',
      hoverBorderColor: '#1e3a8a',
      maxBarThickness: 36
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: { top: 16, right: 16, bottom: 16, left: 12 }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#09090b',
      titleColor: '#fafafa',
      bodyColor: '#e4e4e7',
      padding: 10,
      cornerRadius: 6,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#71717a', font: { size: 12, weight: 500 }, maxRotation: 0 }
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(228, 228, 231, 0.7)' },
      ticks: { color: '#71717a', padding: 8, precision: 0, font: { size: 12 } }
    }
  }
}
</script>

