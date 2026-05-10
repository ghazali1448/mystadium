/**
 * Resolves a relative upload URL (e.g. "/uploads/stadiums/photo.png")
 * to a full, fetchable URL pointing to the backend server.
 * 
 * Handles:
 *   - null/undefined → returns fallback
 *   - Already absolute (http/https) → returns as-is
 *   - Relative (/uploads/...) → prepends backend base URL
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://mystadium.onrender.com/api';
const BACKEND_BASE = API_URL.replace(/\/api\/?$/, '');

export function getImageUrl(relativeUrl, fallback = '/stadium-bg.jpg') {
  if (!relativeUrl) return fallback;
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  // Relative path — prepend backend base
  return `${BACKEND_BASE}${relativeUrl}`;
}
