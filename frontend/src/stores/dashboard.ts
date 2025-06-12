// stores/dashboard.ts
import { defineStore } from "pinia";
import type { Widget } from "../types";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    widgets: [] as Widget[],
  }),
  actions: {
    getWidgets() {
      return this.widgets;
    },
    getWidget(id: string) {
      return this.widgets.find((w) => w.id === id);
    },
    addWidget(widget: Partial<Widget>) {
      const id = "chart_" + Date.now();
      this.widgets.push({
        id,
        type: widget.type || "chart",
        position: widget.position || { x: 0, y: 0, w: 4, h: 4 },
        config: widget.config || {},
      });
      return id;
    },
    removeWidget(id: string) {
      this.widgets = this.widgets.filter((w) => w.id !== id);
    },
    updateWidget(id: string, updates: Partial<Widget>) {
      const widget = this.getWidget(id);
      if (widget) {
        Object.assign(widget, updates);
      }
    },
    saveToLocal() {
      localStorage.setItem("dashboard", JSON.stringify(this.widgets));
    },
    loadFromLocal() {
      const data = localStorage.getItem("dashboard");
      if (data) this.widgets = JSON.parse(data);
    },
    importFromFile(json: string) {
      try {
        const widgets = JSON.parse(json);
        if (Array.isArray(widgets)) this.widgets = widgets;
      } catch (e) {
        console.error("导入失败", e);
      }
    },
  },
});
