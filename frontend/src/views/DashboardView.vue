<template>
  <div>
    <div class="controls">
      <el-button @click="addChart">Add</el-button>
      <el-button @click="saveDashboard">Save</el-button>
      <el-button @click="loadDashboard">Import</el-button>
    </div>
    <div class="grid-stack" ref="gridEl">
      <div v-for="item in dashboardStore.widgets" class="grid-stack-item" :gs-x="item.position.x" :gs-y="item.position.y" :gs-w="item.position.w" :gs-h="item.position.h" :key="item.id" :data-id="item.id">
        <div class="grid-stack-item-content">
          <ChartItem :id="item.id" :type="item.type" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, toRaw, nextTick } from 'vue';
import { useDashboardStore } from '../stores/dashboard';
import { GridStack } from 'gridstack';
import 'gridstack/dist/gridstack.min.css';
import ChartItem from '../components/ChartItem.vue';

const gridEl = ref<HTMLDivElement | null>(null);
const dashboardStore = useDashboardStore();
let gridstack: GridStack;

const addChart = () => {
  if (!Array.isArray(dashboardStore.widgets)) {
    dashboardStore.widgets = [];
  }

  const widgetId = Date.now().toString();
  dashboardStore.widgets.push({
    id: widgetId,
    type: 'chart',
    position: { x: 0, y: 0, w: 4, h: 4 },
    config: {}
  });

  saveDashboard();
  loadDashboard();
};

function saveDashboard() {
  const layout = gridstack.save(false);
  const data = {
    layout,
    widgets: toRaw(dashboardStore.widgets) // 深拷贝业务数据
  };
  localStorage.setItem('dashboard', JSON.stringify(data));
}

// 加载函数
function loadDashboard() {
  const json = localStorage.getItem('dashboard');
  if (!json) return;

  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    console.warn('Dashboard JSON parse failed:', e);
    return;
  }

  const { layout = [], widgets = [] } = parsed;

  if (!Array.isArray(layout) || !Array.isArray(widgets)) {
    console.warn('Dashboard data format invalid');
    return;
  }

  dashboardStore.widgets = widgets;
  gridstack.removeAll();

  layout.forEach(item => {
    const el = document.createElement('div');
    el.innerHTML = `<div data-id="${item.id}" style="width:100%;height:100%">
      <div id="chart-${item.id}" style="width:100%;height:100%"></div>
    </div>`;
    gridstack.addWidget(el, item);

    const mountPoint = document.getElementById(`chart-${item.id}`);
    if (mountPoint) {
      const widgetData = dashboardStore.widgets.find(w => w.id === item.id);
      const app = createApp(ChartItem, {
        id: item.id,
        type: item.type,
        config: widgetData?.config || {}
      });
      app.mount(mountPoint);
    }
  });
}

onMounted(() => {
  gridstack = GridStack.init({ float: true, disableResize: false, disableDrag: false }, gridEl.value!);

  gridstack.load(
    dashboardStore.widgets.map(item => ({
      x: item.position.x,
      y: item.position.y,
      w: item.position.w,
      h: item.position.h,
      content: `<div id="chart-${item.id}" style="width:100%;height:100%"></div>`,
      id: item.id
    }))
  );

  gridstack.on('change', function (event, items) {
    items.forEach(item => {
      const w = dashboardStore.widgets.find(w => w.id === item.id);
      if (w && item.x !== undefined && item.y !== undefined) {
        w.position = { x: item.x, y: item.y, w: item.w, h: item.h };
      }
    });
  });
  // Listen for remove events to clean up Vue renders
  gridstack.on('removed', function (event, items) {
    dashboardStore.widgets = dashboardStore.widgets.filter(widget => !items.some(item => item.id === widget.id));
  });

  nextTick(() => {
    dashboardStore.widgets.forEach(item => {
      const mountPoint = document.getElementById(`chart-${item.id}`);
      if (mountPoint) {
        const app = createApp(ChartItem, { id: item.id, type: item.type });
        app.mount(mountPoint);
      }
    });
  });

  loadDashboard();
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
