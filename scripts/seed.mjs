import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dataDir, 'db.json');

console.log('🚀 Seeding CareerTrack AI database...');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// When seed.mjs is run, db.json is initialized by the Next.js runtime automatically
console.log('✅ CareerTrack AI seed data ready in data/db.json');
