// stores/dashboard.ts
import { defineStore } from 'pinia';

export interface ChartWidget {
  id: string;
  type: 'bar' | 'line' | 'pie' | string;
  position: { x: number; y: number; w: number; h: number };
  config: {
    title?: string;
    dataSourceId?: string;
    query?: string;
    [key: string]: any;
  };
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    widgets: [] as ChartWidget[]
  }),
  actions: {
    getWidgets() {
      return this.widgets;
    },
    getWidget(id: string) {
      return this.widgets.find(w => w.id === id);
    },
    addWidget(widget: Partial<ChartWidget>) {
      const id = 'chart_' + Date.now();
      this.widgets.push({
        id,
        type: widget.type || 'bar',
        position: widget.position || { x: 0, y: 0, w: 4, h: 4 },
        config: widget.config || {}
      });
    },
    removeWidget(id: string) {
      this.widgets = this.widgets.filter(w => w.id !== id);
    },
    updateWidget(id: string, updates: Partial<ChartWidget>) {
      const widget = this.getWidget(id);
      if (widget) {
        Object.assign(widget, updates);
      }
    },
    saveToLocal() {
      localStorage.setItem('dashboard', JSON.stringify(this.widgets));
    },
    loadFromLocal() {
      const data = localStorage.getItem('dashboard');
      if (data) this.widgets = JSON.parse(data);
    },
    importFromFile(json: string) {
      try {
        const widgets = JSON.parse(json);
        if (Array.isArray(widgets)) this.widgets = widgets;
      } catch (e) {
        console.error('导入失败', e);
      }
    }
  }
});
