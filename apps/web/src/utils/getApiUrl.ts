export function getApiUrl(): string {
  // Prefer Vite's import.meta.env at runtime in the browser.
  // Avoid using `typeof import` which is a parsing issue in the bundler.
  try {
    if (typeof window !== 'undefined') {
      const env = (import.meta as any).env;
      if (env && env.VITE_API_URL) return env.VITE_API_URL;
    }
  } catch (e) {
    // ignore - likely running under node/test runner where import.meta isn't available
  }

  // Fallback for tests (ts-jest) or Node environments
  if (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) {
    return process.env.VITE_API_URL as string;
  }

  // Default local API
  return 'http://localhost:3000/api';
}
