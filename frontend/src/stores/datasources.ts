// stores/datasources.ts
import { defineStore } from "pinia";
import axios from "axios";
import type { DataSource } from "../types";

export const useDataSourceStore = defineStore("datasources", {
  state: () => ({
    sources: [] as DataSource[],
  }),
  actions: {
    async fetchSources() {
      const res = await axios.get("/api/data-sources");
      this.sources = res.data || [];
    },
    getById(id: string): DataSource | undefined {
      return this.sources.find((s) => s.id === id);
    },
    setSources(sources: DataSource[]) {
      this.sources = sources;
    },
  },
});
