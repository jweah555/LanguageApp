// Every backend endpoint lives under /api. In development, Vite proxies /api to the
// Spring server (see vite.config.js); in production, Spring serves this app itself.
export const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";
