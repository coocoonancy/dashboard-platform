<!-- components/ChartRenderer.vue -->
<template>
  <div ref="chartRef" style="width: 100%; height: 100%"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const props = defineProps<{ config: any }>();

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const renderChart = () => {
  chartInstance?.setOption({
    title: { text: props.config.title || "Chart" },
    xAxis: {},
    yAxis: {},
    series: [
      {
        type: props.config.type || "bar",
        data: props.config.data || [20, 50, 30, 80],
      },
    ],
  });
};

let resizeObserver;

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    renderChart();
  }
  resizeObserver = new ResizeObserver(() => chartInstance?.resize());
  resizeObserver.observe(chartRef.value);
});

watch(
  () => props.config,
  () => {
    if (chartInstance) {
      chartInstance.setOption(props.config, true); // true 表示不清空旧图层
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chartInstance?.dispose();
});
</script>
