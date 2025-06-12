// stores/datasources.ts
import { defineStore } from "pinia";
import axios from "axios";

export const useDataSourceStore = defineStore("datasources", {
  state: () => ({
    sources: [],
  }),
  actions: {
    async fetchSources() {
      const res = await axios.get("/api/data-sources");
      this.sources = res.data;
    },
  },
});
