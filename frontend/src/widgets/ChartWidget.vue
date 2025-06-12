<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { ref, onMounted } from "vue";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
]);

const props = defineProps({
  widgetId: String,
  widgetType: String,
});

const option = ref({});

onMounted(() => {
  // 模拟图表数据
  option.value = {
    tooltip: {},
    xAxis: { data: ["A", "B", "C", "D"] },
    yAxis: {},
    series: [{ type: props.widgetType, data: [20, 50, 30, 80] }],
  };
});
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
