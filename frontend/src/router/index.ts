import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import DataSourcesView from "../views/DataSourcesView.vue";
const routes = [
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: DashboardView },
  { path: "/data-sources", component: DataSourcesView },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
