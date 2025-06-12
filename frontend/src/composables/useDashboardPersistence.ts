// composables/useDashboardPersistence.ts
import { createApp } from "vue";
import DynamicWidget from "../components/DynamicWidget.vue";
import { useDashboardStore } from "../stores/dashboard";
import { GridStack } from "gridstack";

export function useDashboardPersistence(gridstack: GridStack) {
  const dashboardStore = useDashboardStore();

  function saveDashboard() {
    const layout = gridstack.save(false);
    const widgets = dashboardStore.getWidgets();
    const data = JSON.stringify({ layout, widgets });
    localStorage.setItem("dashboard_data", data);
  }

  function loadDashboard() {
    const raw = localStorage.getItem("dashboard_data");
    if (!raw) return;
    const { layout, widgets } = JSON.parse(raw);
    dashboardStore.widgets = widgets;
    gridstack.removeAll();

    layout.forEach((item) => {
      const el = document.createElement("div");
      el.innerHTML = `<div data-id="${item.id}" style="width:100%;height:100%">
        <div id="chart-${item.id}" style="width:100%;height:100%"></div>
      </div>`;
      gridstack.addWidget(el, item);

      const mountPoint = document.getElementById(`chart-${item.id}`);
      if (mountPoint) {
        const app = createApp(DynamicWidget, { id: item.id });
        app.mount(mountPoint);
      }
    });
  }

  function exportDashboard() {
    const widgets = dashboardStore.getWidgets();
    const data = JSON.stringify(widgets, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importDashboard(json: string) {
    try {
      const widgets = JSON.parse(json);
      if (Array.isArray(widgets)) {
        dashboardStore.widgets = widgets;
        loadDashboard();
      }
    } catch (e) {
      console.error("Import failed:", e);
    }
  }

  return {
    saveDashboard,
    loadDashboard,
    exportDashboard,
    importDashboard,
  };
}
