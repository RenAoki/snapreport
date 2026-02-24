import type { Location } from "./types";

const DB_NAME = "snapreport";
const DB_VERSION = 1;
const STORE = "sessions";
const SESSION_KEY = "current";
const TTL_MS = 24 * 60 * 60 * 1000; // 24時間

type SessionData = {
  locations: Location[];
  savedAt: number;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };

    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * 現在のセッションをIndexedDBに保存
 */
export async function saveSession(locations: Location[]): Promise<void> {
  try {
    const db = await openDB();
    const data: SessionData = { locations, savedAt: Date.now() };

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).put(data, SESSION_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    // IndexedDBが使えない環境（プライベートブラウズ等）では無視
    console.warn("IndexedDB save failed:", err);
  }
}

/**
 * 保存済みセッションを読み込む
 * 24時間を超えていたら自動削除してnullを返す
 */
export async function loadSession(): Promise<Location[] | null> {
  try {
    const db = await openDB();

    const data = await new Promise<SessionData | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(SESSION_KEY);
      req.onsuccess = () => resolve(req.result as SessionData | undefined);
      req.onerror = () => reject(req.error);
    });

    if (!data) return null;

    const age = Date.now() - data.savedAt;
    if (age > TTL_MS) {
      await clearSession();
      return null;
    }

    return data.locations;
  } catch (err) {
    console.warn("IndexedDB load failed:", err);
    return null;
  }
}

/**
 * セッションデータを削除
 */
export async function clearSession(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const req = tx.objectStore(STORE).delete(SESSION_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IndexedDB clear failed:", err);
  }
}
