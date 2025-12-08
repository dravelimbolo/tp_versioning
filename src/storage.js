export function setItem(key, value) {
  try {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
  } catch (err) {
    console.error("storage.setItem error:", err);
  }
}

export function getItem(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error("storage.getItem error:", err);
    return defaultValue;
  }
}

