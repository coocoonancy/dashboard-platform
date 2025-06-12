<template>
  <div>
    <div class="controls">
      <el-button @click="addChart">Add</el-button>
      <el-button @click="saveDashboard">Save</el-button>
      <el-button @click="loadDashboard">Import</el-button>
    </div>
    <div class="grid-stack" ref="gridEl"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useDashboardStore } from "../stores/dashboard";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import DynamicWidget from "../components/DynamicWidget.vue";
import { addWidgetToGrid, loadDashboardToGrid } from "../utils/gridstackHelper";
const gridEl = ref<HTMLDivElement | null>(null);
const dashboardStore = useDashboardStore();
let gridstack: GridStack;

function addChart() {
  const id = dashboardStore.addWidget({
    position: { x: 0, y: 0, w: 4, h: 4 },
    config: {
      chartType: "line",
    },
  });
  const newWidget = dashboardStore.getWidget(id);

  addWidgetToGrid(
    gridstack,
    id,
    DynamicWidget,
    {
      id,
      type: newWidget.type,
      config: newWidget.config,
    },
    newWidget.position
  );
  saveDashboard();
}

function saveDashboard() {
  const layout = gridstack.save(false);
  localStorage.setItem(
    "dashboard",
    JSON.stringify({
      layout,
      widgets: dashboardStore.widgets,
    })
  );
}

function loadDashboard() {
  const json = localStorage.getItem("dashboard");
  if (json) {
    const data = JSON.parse(json);
    dashboardStore.widgets = data.widgets || [];
    loadDashboardToGrid(gridstack, dashboardStore.widgets, DynamicWidget);
  }
}

onMounted(() => {
  gridstack = GridStack.init({ float: true }, gridEl.value!);
  // 初始加载
  const json = localStorage.getItem("dashboard");
  if (json) {
    const data = JSON.parse(json);
    dashboardStore.widgets = data.widgets || [];
    loadDashboardToGrid(gridstack, dashboardStore.widgets, DynamicWidget);
  }

  gridstack.on("change", function (event, items) {
    items.forEach((item) => {
      const w = dashboardStore.widgets.find((w) => w.id === item.id);
      if (w && item.x !== undefined && item.y !== undefined) {
        w.position = { x: item.x, y: item.y, w: item.w, h: item.h };
      }
    });
  });

  gridstack.on("removed", function (event, items) {
    dashboardStore.widgets = dashboardStore.widgets.filter(
      (widget) => !items.some((item) => item.id === widget.id)
    );
  });
});
</script>

<style>
.controls {
  position: relative;
  display: flex;
  height: var(--nav_h);
  align-items: center;
  font-size: 0.9em;
  font-weight: var(--nav_font_w_regular);
  overflow-x: auto;
  overflow-y: hidden;
}
.grid-stack-item-content {
  background: #f5f5f5;
  border: 1px solid #ccc;
}
</style>
