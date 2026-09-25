/**
 * Mockup Studio - Robust IndexedDB Persistence Engine
 * 
 * Provides unlimited, reliable local database storage for user presets,
 * scene configuration, and slot image states across app restarts.
 */

import { CardSlot, SceneConfig, UserPreset } from '../types';

const DB_NAME = 'MockupStudioDB';
const DB_VERSION = 1;

const STORES = {
  PRESETS: 'presets',
  APP_STATE: 'app_state',
  SLOTS: 'slots',
} as const;

let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB is not available in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORES.PRESETS)) {
          db.createObjectStore(STORES.PRESETS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.APP_STATE)) {
          db.createObjectStore(STORES.APP_STATE, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORES.SLOTS)) {
          db.createObjectStore(STORES.SLOTS, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
  return dbPromise;
}

// -------------------------------------------------------------
// Presets Persistence
// -------------------------------------------------------------

export async function dbGetAllPresets(): Promise<UserPreset[]> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.PRESETS, 'readonly');
      const store = tx.objectStore(STORES.PRESETS);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as UserPreset[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('IndexedDB read presets failed, fallback:', err);
    return [];
  }
}

export async function dbSavePreset(preset: UserPreset): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORES.PRESETS, 'readwrite');
    const store = tx.objectStore(STORES.PRESETS);
    store.put(preset);
  } catch (err) {
    console.error('IndexedDB save preset failed:', err);
  }
}

export async function dbSaveAllPresets(presets: UserPreset[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORES.PRESETS, 'readwrite');
    const store = tx.objectStore(STORES.PRESETS);
    store.clear();
    for (const p of presets) {
      store.put(p);
    }
  } catch (err) {
    console.error('IndexedDB save all presets failed:', err);
  }
}

export async function dbDeletePreset(presetId: string): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORES.PRESETS, 'readwrite');
    const store = tx.objectStore(STORES.PRESETS);
    store.delete(presetId);
  } catch (err) {
    console.error('IndexedDB delete preset failed:', err);
  }
}

// -------------------------------------------------------------
// App State (Scene, Active Preset, etc.)
// -------------------------------------------------------------

export async function dbGetAppState<T>(key: string): Promise<T | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.APP_STATE, 'readonly');
      const store = tx.objectStore(STORES.APP_STATE);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result && 'val' in req.result) {
          resolve(req.result.val as T);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function dbSetAppState<T>(key: string, val: T): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORES.APP_STATE, 'readwrite');
    const store = tx.objectStore(STORES.APP_STATE);
    store.put({ key, val });
  } catch (err) {
    console.error('IndexedDB set app state failed:', err);
  }
}

// -------------------------------------------------------------
// Slots & Images Persistence
// -------------------------------------------------------------

export async function dbSaveSlots(slots: CardSlot[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORES.SLOTS, 'readwrite');
    const store = tx.objectStore(STORES.SLOTS);
    store.clear();
    for (const slot of slots) {
      store.put(slot);
    }
  } catch (err) {
    console.error('IndexedDB save slots failed:', err);
  }
}

export async function dbGetSlots(): Promise<CardSlot[] | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.SLOTS, 'readonly');
      const store = tx.objectStore(STORES.SLOTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const res = req.result as CardSlot[];
        resolve(res && res.length > 0 ? res : null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
