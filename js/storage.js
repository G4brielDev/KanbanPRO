const DB_NAME = "kanban-pro-db";
const STORE_NAME = "app-state";
const FALLBACK_KEY = "kanban-pro-fallback";

const isIndexedDBSupported = () => typeof indexedDB !== "undefined";

const openDb = () =>
  new Promise((resolve, reject) => {
    if (!isIndexedDBSupported())
      return reject(new Error("IndexedDB not supported"));
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const fallbackStorage = {
  get(key) {
    const value = localStorage.getItem(`${FALLBACK_KEY}:${key}`);
    return value ? JSON.parse(value) : null;
  },
  set(key, value) {
    localStorage.setItem(`${FALLBACK_KEY}:${key}`, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(`${FALLBACK_KEY}:${key}`);
  },
  clear() {
    Object.keys(localStorage).forEach((item) => {
      if (item.startsWith(FALLBACK_KEY)) localStorage.removeItem(item);
    });
  },
};

const dbStorage = {
  async get(key) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value ?? null);
      request.onerror = () => reject(request.error);
    });
  },
  async set(key, value) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  async remove(key) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  async clear() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
};

let storage = dbStorage;

const initStorage = async () => {
  try {
    await dbStorage.get("__probe__");
  } catch {
    storage = fallbackStorage;
  }
};

await initStorage();

export const storage = {
  get: (key) => storage.get(key),
  set: (key, value) => storage.set(key, value),
  remove: (key) => storage.remove(key),
  clear: () => storage.clear(),
};
