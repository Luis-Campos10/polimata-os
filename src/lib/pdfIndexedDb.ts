// IndexedDB Utilitario para Almacenamiento Permanente de PDFs en Celulares y Navegadores
const DB_NAME = 'PolimataPdfStore';
const DB_VERSION = 1;
const STORE_NAME = 'pdfs';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB no está disponible en este entorno.'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('targetId', 'targetId', { unique: false });
      }
    };
  });
}

export interface StoredPdfDoc {
  id: string;
  targetId: string;
  targetType: string;
  fileName: string;
  filePath: string; // Base64 o Blob URL
  fileSize: number;
  createdAt: string;
}

export async function savePdfToIndexedDb(doc: StoredPdfDoc): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(doc);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error guardando PDF en IndexedDB:', err);
  }
}

export async function getPdfsFromIndexedDb(targetId: string): Promise<StoredPdfDoc[]> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const index = store.index('targetId');
      const req = index.getAll(targetId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error cargando PDFs desde IndexedDB:', err);
    return [];
  }
}

export async function deletePdfFromIndexedDb(id: string): Promise<void> {
  try {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error eliminando PDF de IndexedDB:', err);
  }
}
