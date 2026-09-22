import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

// In-memory cache synced with disk
let store = null;

export function getStore() {
  if (!store) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      store = JSON.parse(raw);
    } catch (err) {
      console.error('Failed to read store.json, creating fallback:', err);
      store = {
        department: {},
        rooms: [],
        complaints: [],
        scholarships: [],
        events: [],
        updates: [],
        faculty: []
      };
    }
  }
  return store;
}

export function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to write store.json:', err);
    return false;
  }
}
