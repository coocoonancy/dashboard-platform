<template>
  <div class="dynamic-widget">
    <component
      :is="widgetComponent"
      v-if="!loading && !error"
      :config="config"
      :data="data"
    />
    <div v-else-if="loading" class="loading">Loading...</div>
    <div v-else class="error">Error: {{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from "vue";
import { getWidgetComponent } from "../utils/widgetRenderer.ts";
import { fetchData } from "../utils/dataLoader.ts";
import { useDataSourceStore } from "../stores/datasources.ts"; // 你可以封装这个 Store 存数据源

const props = defineProps<{
  type: string;
  config: {
    dataSourceId?: string;
    query?: string;
    [key: string]: any;
  };
}>();

const loading = ref(false);
const error = ref<string | null>(null);
const data = ref<any[]>([]);

const widgetComponent = computed(() => getWidgetComponent(props.type));

watchEffect(async () => {
  error.value = null;
  loading.value = true;
  data.value = [];

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

    data.value = await fetchData(ds, props.config.query);
  } catch (e: any) {
    error.value = e.message || "Unknown error";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.dynamic-widget {
  width: 100%;
  height: 100%;
}
.loading,
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
}
.error {
  color: red;
}
</style>
