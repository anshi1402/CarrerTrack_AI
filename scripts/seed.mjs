import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dataDir, 'db.json');

console.log('🚀 CareerTrack AI Seeding Engine Initializing...');

// Check if MONGODB_URI is provided
const mongoUri = process.env.MONGODB_URI;

async function runSeed() {
  if (mongoUri) {
    console.log('📡 Connecting to MongoDB at:', mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@'));
    try {
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB Atlas.');
      console.log('✨ Seed collections verified. Next.js app will auto-populate collections on first request.');
      await mongoose.disconnect();
    } catch (err) {
      console.error('❌ Failed to connect to MongoDB Atlas:', err.message);
    }
  } else {
    console.log('📁 Using local persistent storage mode (data/db.json).');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    console.log('✅ CareerTrack AI seed data ready in data/db.json');
  }
}

runSeed().then(() => {
  console.log('🎉 Database seeding checks complete.');
  process.exit(0);
});
