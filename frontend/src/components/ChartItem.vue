<template>
  <div class="chart-item">
    <ChartRenderer :config="chartConfig" />
    <i class="iconfont icon-settings1" @click="drawerVisible = true"></i>
    <el-drawer v-model="drawerVisible" title="Chart Settings" direction="rtl" size="30%">
      <ChartConfigPanel :initialConfig="chartConfig" @applyConfig="updateConfig" />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ChartRenderer from './ChartRenderer.vue';
import ChartConfigPanel from './ChartConfigPanel.vue';
import { ElDrawer, ElButton } from 'element-plus';
const props = defineProps<{ id: string }>();
const chartConfig = ref({});
const drawerVisible = ref(false);
const updateConfig = (newConfig: any) => {
  chartConfig.value = newConfig;
  drawerVisible.value = false;
};
</script>
<style lang="scss" scoped>
.chart-item {
  position: relative;
  width: 100%;
  height: 100%;
  .icon-settings1 {
    font-size: 20px;
    position: absolute;
    right: 8px;
    top: 8px;
  }
}
</style>
