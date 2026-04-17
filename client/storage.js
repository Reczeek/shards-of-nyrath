import { STORAGE_KEYS, SAVE_VERSION } from "./config.js";
import { createDefaultMeta } from "./state.js";

export function saveRun(run) {
  localStorage.setItem(STORAGE_KEYS.RUN, JSON.stringify(run));
  localStorage.setItem(STORAGE_KEYS.VERSION, String(SAVE_VERSION));
}

export function loadRun() {
  const raw = localStorage.getItem(STORAGE_KEYS.RUN);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Błąd parsowania runa:", err);
    return null;
  }
}

export function clearRun() {
  localStorage.removeItem(STORAGE_KEYS.RUN);
}

export function saveMeta(meta) {
  localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(meta));
}

export function loadMeta() {
  const raw = localStorage.getItem(STORAGE_KEYS.META);
  if (!raw) {
    const fresh = createDefaultMeta();
    saveMeta(fresh);
    return fresh;
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Błąd parsowania meta:", err);
    const fresh = createDefaultMeta();
    saveMeta(fresh);
    return fresh;
  }
}