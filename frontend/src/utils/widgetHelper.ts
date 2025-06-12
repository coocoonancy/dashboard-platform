// utils/WidgetRenderer.ts
import ChartRenderer from "../widgets/renders/ChartRenderer.vue";
import TableRenderer from "../widgets/renders/TableRenderer.vue";
import TextRenderer from "../widgets/renders/TextRenderer.vue";
import CarouselRenderer from "../widgets/renders/CarouselRenderer.vue";
import ImageRenderer from "../widgets/renders/ImageRenderer.vue";
import DefaultRenderer from "../widgets/renders/DefaultRenderer.vue";

import ChartConfigPanel from "../widgets/configs/ChartConfigPanel.vue";
import TableConfigPanel from "../widgets/configs/TableConfigPanel.vue";
import TextConfigPanel from "../widgets/configs/TextConfigPanel.vue";
import CarouselConfigPanel from "../widgets/configs/CarouselConfigPanel.vue";
import ImageConfigPanel from "../widgets/configs/ImageConfigPanel.vue";
import DefaultConfigPanel from "../widgets/configs/DefaultConfigPanel.vue";

export const RendererComponentMap: Record<string, any> = {
  chart: ChartRenderer,
  table: TableRenderer,
  text: TextRenderer,
  carousel: CarouselRenderer,
  image: ImageRenderer,
  default: DefaultRenderer,
};

export const ConfigComponentMap: Record<string, any> = {
  chart: ChartConfigPanel,
  table: TableConfigPanel,
  text: TextConfigPanel,
  carousel: CarouselConfigPanel,
  image: ImageConfigPanel,
  default: DefaultConfigPanel,
};

export function getRendererComponent(type: string): any {
  return RendererComponentMap[type] || DefaultRenderer;
}

export function getConfigComponent(type: string): any {
  return ConfigComponentMap[type] || DefaultConfigPanel;
}
