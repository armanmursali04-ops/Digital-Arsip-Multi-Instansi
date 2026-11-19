<template>
  <div class="relative h-72 w-full">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{
  labels: string[]
  values: number[]
  colors: string[]
  label?: string
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.label || 'Arsip',
      data: props.values,
      backgroundColor: props.colors,
      borderColor: props.labels.map(() => '#FFFFFF'),
      borderWidth: 2,
      hoverOffset: 10
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  layout: {
    padding: { top: 16, right: 16, bottom: 16, left: 16 }
  },
  plugins: {
    legend: {
      position: 'right' as const,
      align: 'center' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'circle' as const,
        padding: 16,
        boxWidth: 12,
        boxHeight: 12,
        color: '#1F2937',
        font: { size: 12, weight: 500 }
      }
    },
    tooltip: {
      backgroundColor: '#0F172A',
      titleColor: '#F8FAFC',
      bodyColor: '#E2E8F0',
      padding: 12,
      cornerRadius: 8,
      displayColors: false
    }
  }
}
</script>

