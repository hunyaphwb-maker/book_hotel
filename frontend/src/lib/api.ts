// Centralized API base URL.
// In production build, VITE_API_URL is baked in at build time.
// In dev, it defaults to the local Laravel server.
export const API_URL: string = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
