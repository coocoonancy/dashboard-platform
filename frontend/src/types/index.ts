export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  layout: Widget[];
}

export interface Widget {
  id: string;
  type: 'chart' | 'table' | 'text' | string;
  chartType?: string;
  position: { x: number; y: number; w: number; h: number };
  config: {
    title?: string;
    dataSourceId?: string;
    query?: string;
    [key: string]: any;
  };
}

export interface DataSource {
  id: string;
  type: 'mongo' | 'mysql' | 'supernet' | 'api';
  name: string;
  config: Record<string, any>;
}
