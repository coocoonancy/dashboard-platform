// utils/DataLoader.ts
import type { DataSource } from "../types";

export async function fetchData(
  dataSource: DataSource,
  query: string
): Promise<any[]> {
  switch (dataSource.type) {
    case "mysql":
    case "mongo":
      return fetchFromBackend(dataSource, query);
    case "supernet":
      return fetchFromSupernet(dataSource, query);
    case "dataease":
      return fetchFromDataEase(dataSource, query);
    case "api":
      return fetchFromAPI(dataSource.config.url);
    default:
      console.warn("Unknown data source type:", dataSource.type);
      return [];
  }
}

// 本地后端代理接口，例如：/api/query/mysql
async function fetchFromBackend(dataSource: DataSource, query: string) {
  const res = await fetch("/api/query/" + dataSource.type, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      config: dataSource.config,
      query,
    }),
  });
  return await res.json();
}

async function fetchFromSupernet(dataSource: DataSource, query: string) {
  const res = await fetch(dataSource.config.endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${dataSource.config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  return await res.json();
}

async function fetchFromDataEase(dataSource: DataSource, query: string) {
  // 假设 DataEase 提供的是 URL + query 参数拼接方式
  const url = `${dataSource.config.url}?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${dataSource.config.token}`,
    },
  });
  return await res.json();
}

async function fetchFromAPI(apiUrl: string) {
  const res = await fetch(apiUrl);
  return await res.json();
}
