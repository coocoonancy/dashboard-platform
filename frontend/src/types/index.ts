export type EChartsType =
  | "bar"
  | "line"
  | "pie"
  | "scatter"
  | "radar"
  | "gauge"
  | "funnel"
  | "heatmap"
  | string;

export type WidgetType =
  | "chart"
  | "table"
  | "text"
  | "carousel"
  | "image"
  | "custom" // 支持自定义组件
  | string; // 拓展空间

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetConfig {
  chartType?: EChartsType; // 如果是 chart，需指定类型
  query?: string; // 数据查询语句
  staticData?: any[]; // 静态数据（文本或测试数据）
  options?: Record<string, any>; // 传给组件的 ECharts/table 等配置
  style?: Record<string, any>; // 样式配置，如字体、颜色等
  [key: string]: any; // 允许组件自定义参数
}

export interface DataSource {
  id: string;
  name: string;
  type: "mongo" | "mysql" | "supernet" | "dataease" | "api" | string;
  config: Record<string, any>; // 可支持 token、url、数据库连接等
}

export interface Widget {
  id: string;
  type: WidgetType;
  dataSourceId?: string;
  title?: string;
  position: WidgetPosition;
  config: WidgetConfig; // 核心配置
}
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  layout: Widget[];
}
