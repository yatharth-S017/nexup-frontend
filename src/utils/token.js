import { STORAGE_KEYS } from '../constants/app.js';

export function getAuthToken() {
  return window.localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

export function setAuthToken(token) {
  window.localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
}
