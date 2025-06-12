<template>
  <div class="dynamic-widget">
    <component
      v-if="!loading && !error"
      :is="rendererName"
      :config="widgetConfig"
      :data="widgetData"
      class="widget-content"
    />

    <div v-else-if="loading" class="loading">Loading...</div>
    <div v-else class="error">Error: {{ error }}</div>

    <i class="iconfont icon-settings1" @click="drawerVisible = true"></i>

    <el-drawer
      v-model="drawerVisible"
      title="Widget Settings"
      direction="rtl"
      size="32%"
    >
      <component
        :is="configName"
        :initialConfig="widgetConfig"
        @applyConfig="applyConfig"
      />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import {
  getRendererComponent,
  getConfigComponent,
} from "../utils/widgetHelper.ts";
import { useDashboardStore } from "../stores/dashboard";
import { ElDrawer } from "element-plus";
import { fetchData } from "../utils/dataLoader.ts";
import { useDataSourceStore } from "../stores/datasources.ts";
// Props
const props = defineProps<{
  id: string;
  type: string;
  config: Record<string, any>;
}>();

const loading = ref(false);
const error = ref<string | null>(null);
const widgetData = ref<any[]>([]);

const dashboardStore = useDashboardStore();
const drawerVisible = ref(false);

// 1. 当前组件的 config，响应式拷贝
const widgetConfig = ref({ ...props.config });

// 2. 类型映射 - 渲染组件
const rendererName = computed(() => getRendererComponent(props.type));
// 3. 类型映射 - 配置组件
const configName = computed(() => getConfigComponent(props.type));

watchEffect(async () => {
  error.value = null;
  loading.value = true;
  widgetData.value = [];

  try {
    if (!props.config.dataSourceId || !props.config.query) {
      loading.value = false;
      return;
    }

    const dsStore = useDataSourceStore();
    const ds = dsStore.getById(props.config.dataSourceId);

    if (!ds) {
      throw new Error("Data source not found");
    }

    widgetData.value = await fetchData(ds, props.config.query);
  } catch (e: any) {
    error.value = e.message || "Unknown error";
  } finally {
    loading.value = false;
  }
});

// 4. 更新配置并同步到 Pinia store
function applyConfig(newConfig: any) {
  widgetConfig.value = newConfig;
  dashboardStore.updateWidget(props.id, { config: newConfig });
  drawerVisible.value = false;
}
</script>

<style scoped>
.dynamic-widget {
  position: relative;
  width: 100%;
  height: 100%;
}
.icon-settings1 {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 20px;
  z-index: 10;
  cursor: pointer;
}
.widget-content {
  width: 100%;
  height: 100%;
}
</style>
