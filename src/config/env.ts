// Si TypeScript marca advertencia, puedes usar import.meta.env directamente
const rawApiUrl = (import.meta.env.VITE_API_URL as string)?.trim();

if (!rawApiUrl) {
  throw new Error('Falta la variable VITE_API_URL en el archivo .env.local');
}

export const API_URL = rawApiUrl.replace(/\/+$/, '');