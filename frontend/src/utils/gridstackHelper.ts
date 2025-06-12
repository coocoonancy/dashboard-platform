// utils/gridstack-helper.ts
import { createApp } from "vue";
import type { Component } from "vue";
import type { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";

/**
 * 添加 widget 到 GridStack 容器中，并挂载 Vue 组件
 * @param grid GridStack 实例
 * @param widgetId 唯一 id
 * @param vueComponent 需要挂载的 Vue 组件
 * @param props 组件 props
 * @param position 位置和大小
 */
export function addWidgetToGrid(
  grid: GridStack,
  widgetId: string,
  vueComponent: Component,
  props: Record<string, any>,
  position: { x: number; y: number; w: number; h: number }
) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="grid-stack-item-content" data-id="${widgetId}" style="width:100%;height:100%;">
      <div id="mount-${widgetId}" style="width:100%;height:100%;"></div>
    </div>
  `;

  const el = wrapper.firstElementChild as HTMLElement;
  console.log(el);

  // 添加到 GridStack
  grid.addWidget(el, {
    x: position.x,
    y: position.y,
    w: position.w,
    h: position.h,
    id: widgetId,
  });

  // 挂载 Vue 组件
  const mountPoint = document.getElementById(`mount-${widgetId}`);
  if (mountPoint) {
    const app = createApp(vueComponent, props);
    app.mount(mountPoint);
  }
}

/**
 * 批量加载 dashboard 数据
 */
export function loadDashboardToGrid(
  grid: GridStack,
  widgets: any[],
  vueComponent: Component
) {
  grid.removeAll();

  widgets.forEach((widget) => {
    addWidgetToGrid(
      grid,
      widget.id,
      vueComponent,
      {
        id: widget.id,
        type: widget.type,
        config: widget.config || {},
      },
      widget.position
    );
  });
}
